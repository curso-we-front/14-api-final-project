const pool = require("../db/connection");

async function migrate() {
  const conn = await pool.getConnection();

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','editor','author','reader') DEFAULT 'reader',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,

        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,

        status ENUM(
          'draft',
          'published',
          'archived'
        ) DEFAULT 'draft',

         author_id INT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

          FOREIGN KEY (author_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS article_categories (
        article_id INT NOT NULL,
        category_id INT NOT NULL,

        PRIMARY KEY (article_id, category_id),

        FOREIGN KEY (article_id)
          REFERENCES articles(id)
          ON DELETE CASCADE,

        FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,

      article_id INT NOT NULL,
      user_id INT NOT NULL,

      parent_id INT NULL,

      content TEXT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY (article_id)
      REFERENCES articles(id)
      ON DELETE CASCADE,

      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

      FOREIGN KEY (parent_id)
      REFERENCES comments(id)
      ON DELETE CASCADE
    )
    `);
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("❌ Error en migración:", err.message);
  process.exit(1);
});
