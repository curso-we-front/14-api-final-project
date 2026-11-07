function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Access denied" })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "User without permission" })
    }
    next()
  }
}

module.exports = { authorize }
