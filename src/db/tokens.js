const mongoose = require("mongoose")
const crypto = require("crypto")

const refreshTokenSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    required: true,
    type: Date,
  },
})

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

async function saveRefreshToken(userId, token, expiresAt) {
  const refreshHashToken = hashToken(token)
  const refreshToken = await RefreshToken.create({
    tokenHash: refreshHashToken,
    userId,
    expiresAt,
  })

  return refreshToken
}

async function findRefreshToken(token) {
  const hashedToken = hashToken(token)
  const findToken = await RefreshToken.findOne({ tokenHash: hashedToken })
  if (!findToken || findToken.expiresAt < Date.now()) {
    return null
  }

  return findToken
}

async function deleteRefreshToken(token) {
  const hashedToken = hashToken(token)
  await RefreshToken.deleteOne({ tokenHash: hashedToken })
}

module.exports = { saveRefreshToken, findRefreshToken, deleteRefreshToken }
