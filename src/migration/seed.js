const pool = require("../db/connection");
const articles = require("../../data/articles.json");

const users = [
  [1, "Ana García", "ana@test.com", "password123", "author"],
  [2, "Carlos López", "carlos@test.com", "password123", "author"],
  [3, "María Torres", "maria@test.com", "password123", "author"],
  [4, "Pedro Sanz", "pedro@test.com", "password123", "reader"],
  [5, "Laura Ruiz", "laura@test.com", "password123", "reader"],
  [6, "Marta Gil", "marta@test.com", "password123", "reader"],
];

const authorMap = {
  "Ana García": 1,
  "Carlos López": 2,
  "María Torres": 3,
};

const categories = [
  [1, "Backend", "backend"],
  [2, "Frontend", "frontend"],
  [3, "Bases de datos", "bases-de-datos"],
  [4, "Seguridad", "seguridad"],
];

const articleCategories = [
  [1, 1],
  [2, 1],
  [4, 1],
  [5, 1],
  [5, 4],
];

const comments = [
  [1, 4, null, "Muy buen artículo"],
  [1, 5, null, "¿Hay ejemplos en TS?"],
  [2, 4, null, "Express es genial"],
  [4, 6, null, "Muy claro todo"],

  [1, 1, 1, "Gracias por leerlo"],
  [1, 2, 2, "Sí, pronto publicaré ejemplos"],
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function seed() {
  const conn = await pool.getConnection();

  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    await conn.query("TRUNCATE TABLE comments");
    await conn.query("TRUNCATE TABLE article_categories");
    await conn.query("TRUNCATE TABLE categories");
    await conn.query("TRUNCATE TABLE articles");
    await conn.query("TRUNCATE TABLE users");

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    for (const user of users) {
      await conn.query(
        `INSERT INTO users (id, username, email, password, role)
         VALUES (?, ?, ?, ?, ?)`,
        user,
      );
    }

    for (const article of articles) {
      const status = article.published ? "published" : "draft";

      await conn.query(
        `INSERT INTO articles
    (id, title, content, slug, author_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          article.id,
          article.title,
          article.content,
          slugify(article.title),
          authorMap[article.author],
          status,
          new Date(article.createdAt),
        ],
      );
    }

    for (const category of categories) {
      await conn.query(
        `INSERT INTO categories (id, name, slug)
         VALUES (?, ?, ?)`,
        category,
      );
    }

    for (const articleCategory of articleCategories) {
      await conn.query(
        `INSERT INTO article_categories (article_id, category_id)
         VALUES (?, ?)`,
        articleCategory,
      );
    }

    for (const comment of comments) {
      await conn.query(
        `INSERT INTO comments
     (article_id, user_id, parent_id, content)
     VALUES (?, ?, ?, ?)`,
        comment,
      );
    }
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Error en seed:", err.message);
  process.exit(1);
});
