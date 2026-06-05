const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  try {
    await pool.getConnection();
    console.log("✅ Conexión exitosa a la base de datos");
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  }
}

testConnection();

module.exports = pool;
