const jwt = require("jsonwebtoken")

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token required" })
  }
  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.user = payload
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Expired token" })
    }
    return res.status(401).json({ error: "Invalid token" })
  }
}

module.exports = { requireAuth }
