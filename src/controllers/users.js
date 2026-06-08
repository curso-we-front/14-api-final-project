const pool = require("../db/connection");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function createUser({ username, email, password, role }) {
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password_hash, role],
  );

  const [rows] = await pool.execute(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [result.insertId],
  );

  return rows[0];
}

async function findUserByEmail(email) {
  const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return user[0] || null;
}

async function findUserById(id) {
  const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return user[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
