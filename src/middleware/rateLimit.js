const rateLimit = require("express-rate-limit");

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
  message: {
    error: "Demasiadas peticiones, intenta más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    error: "Demasiados intentos de login/register, intenta más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  publicLimiter,
  authLimiter,
};