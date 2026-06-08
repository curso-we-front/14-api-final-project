function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
}

module.exports = {
  requireRole,
};