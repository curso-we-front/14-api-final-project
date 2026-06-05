const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({ message: "No hay header Authorization" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "El formato no es Bearer ..." });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ message: "El token es inválido o expiró" });
  }
}

module.exports = { requireAuth };
