const mongoose = require("mongoose")
const { ROLES } = require("../config/roles")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.READER },
})

module.exports = mongoose.model("User", userSchema)
