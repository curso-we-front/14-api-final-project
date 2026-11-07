const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 10
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const config = require("../config/index")
const { saveRefreshToken, findRefreshToken, deleteRefreshToken } = require("../db/tokens")
const asyncHandler = require("../utils/asyncHandler")

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({
    name,
    email,
    password: hashPassword,
  })
  const userData = { id: user._id, name: user.name, email: user.email, role: user.role }
  return res.status(201).json(userData)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(401).json({ error: "User not registered" })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password" })
  }
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpires,
  })
  const refreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpires,
  })
  const refreshTokenExpiresAt = new Date(Date.now() + SEVEN_DAYS_IN_MS)
  await saveRefreshToken(user._id, refreshToken, refreshTokenExpiresAt)

  return res.status(200).json({ token, refreshToken })
})

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token not found" })
  }
  const tokenDoc = await findRefreshToken(refreshToken)
  if (!tokenDoc) {
    return res.status(401).json({ error: "Refresh token does not exist or expired" })
  }
  await deleteRefreshToken(refreshToken)
  const user = await User.findById(tokenDoc.userId)
  const newToken = jwt.sign({ id: user._id, role: user.role }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpires,
  })
  const newRefreshToken = jwt.sign({ id: user._id, role: user.role }, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpires,
  })
  const refreshTokenExpiresAt = new Date(Date.now() + SEVEN_DAYS_IN_MS)
  await saveRefreshToken(user._id, newRefreshToken, refreshTokenExpiresAt)
  return res.status(200).json({ newToken, newRefreshToken })
})

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token does not exist" })
  }
  await deleteRefreshToken(refreshToken)
  res.status(204).send()
})

module.exports = { register, login, refresh, logout }
