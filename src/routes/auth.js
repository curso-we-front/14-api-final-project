const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth");
const { validateUser, validateLogin } = require("../middleware/validate");

router.post("/register", validateUser, register);
router.post("/login", validateLogin, login);

module.exports = router;
