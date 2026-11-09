const rateLimit = require("express-rate-limit")
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000

const authLimit = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: 10,
  message: { error: "Too many requests, try again later" },
})

const publicLimit = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  max: 100,
  message: { error: "Too many requests, try again later" },
})

module.exports = { authLimit, publicLimit }
