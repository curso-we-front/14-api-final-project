require("dotenv").config()
const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
}
module.exports = config
