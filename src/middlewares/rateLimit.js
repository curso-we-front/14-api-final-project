const rateLimit = require("express-rate-limit")

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, try again later" },
})

const publicLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later" },
})

module.exports = { authLimit, publicLimit }
