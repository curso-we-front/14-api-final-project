const { connect } = require("./db/connection")
const config = require("./config/index")
const app = require("./app")

connect()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err.message)
    process.exit(1)
  })
