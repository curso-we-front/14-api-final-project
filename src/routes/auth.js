const express = require("express")
const router = express.Router()
const { register, login, refresh, logout } = require("../controllers/auth")
const { validateBody, registerSchema, loginSchema } = require("../middlewares/validate")
const { authLimit } = require("../middlewares/rateLimit")

router.post("/register", authLimit, validateBody(registerSchema), register)
router.post("/login", authLimit, validateBody(loginSchema), login)
router.post("/refresh", refresh)
router.delete("/logout", logout)

module.exports = router
