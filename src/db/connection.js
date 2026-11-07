const config = require("../config/index")
const mongoose = require("mongoose")

async function connect(uri) {
  const target = uri || config.mongoUri
  await mongoose.connect(target)
  console.log("MongoDB connnected")
}

async function disconnect() {
  await mongoose.disconnect()
}
module.exports = { connect, disconnect }
