const MONGO_DUPLICATE_KEY_ERROR = 11000

function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ error: `${field} already exists` })
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` })
  }

  const status = err.status || 500
  res.status(status).json({ error: err.message || "Internal Server Error" })
}
module.exports = { errorHandler }
