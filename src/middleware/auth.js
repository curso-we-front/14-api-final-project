const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({ error: "No hay header Authorization" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Formato inválido. Usa Bearer token" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = { requireAuth };