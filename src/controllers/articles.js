const pool = require("../db/connection");

async function getAll(req, res, next) {
  try {
    const {
      status,
      category,
      author,
      searchText,
      page = 1,
      limit = 10,
      sort = "created_at",
    } = req.query;

    const allowedSortFields = [
      "created_at",
      "updated_at",
      "title",
      "status",
      "author_id",
    ];

    if (!allowedSortFields.includes(sort)) {
      return res.status(400).json({
        error: "Campo de ordenación no válido",
      });
    }

    const offset = (Number(page) - 1) * Number(limit);

    let sql = `
      SELECT articles.*,
      GROUP_CONCAT(categories.name) AS categories
      FROM articles
      LEFT JOIN article_categories
        ON articles.id = article_categories.article_id
      LEFT JOIN categories
        ON categories.id = article_categories.category_id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      sql += " AND articles.status = ?";
      params.push(status);
    }

    if (author) {
      sql += " AND articles.author_id = ?";
      params.push(author);
    }

    if (searchText) {
      sql += " AND (articles.title LIKE ? OR articles.content LIKE ?)";
      params.push(`%${searchText}%`, `%${searchText}%`);
    }

    if (category) {
      sql += " AND categories.name = ?";
      params.push(category);
    }

    sql += " GROUP BY articles.id";

    // Campo validado mediante whitelist
    sql += ` ORDER BY articles.${sort} DESC`;

    sql += " LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const [articles] = await pool.query(sql, params);

    res.json(articles);
  } catch (err) {
    next(err);
  }
}
async function create(req, res, next) {
  try {
    const { title, content, slug, status, author_id } = req.body;
    const authorId = Number(req.user?.id ?? null);
    const role = req.user?.role ?? null;

    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "No tienes permiso para editar este artículo",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO articles (title, content, slug, status, author_id) VALUES (?, ?, ?, ?, ?)",
      [title, content, slug, status, authorId],
    );
    const [rows] = await pool.execute("SELECT * FROM articles WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, slug, status, authorId } = req.body;

    const [rows] = await pool.execute("SELECT * FROM articles WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    const article = rows[0];

    const role = req.user?.role;
    const userId = Number(req.user?.id);
    const ownerId = Number(article.author_id);

    if (role !== "admin" && role !== "editor" && ownerId !== userId) {
      return res.status(403).json({
        error: "No tienes permiso para editar este artículo",
      });
    }

    await pool.execute(
      `UPDATE articles
       SET title = ?, content = ?, slug = ?, status = ?, author_id = ?
       WHERE id = ?`,
      [
        title ?? article.title,
        content ?? article.content,
        slug ?? article.slug,
        status ?? article.status,
        authorId ?? article.author_id,
        id,
      ],
    );

    const [updated] = await pool.execute(
      "SELECT * FROM articles WHERE id = ?",
      [id],
    );

    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const [rows] = await pool.execute("SELECT * FROM articles WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    const article = rows[0];

    const role = req.user?.role;
    const userId = Number(req.user?.id);
    const ownerId = Number(article.author_id);

    if (role !== "admin" && role !== "editor" && ownerId !== userId) {
      return res.status(403).json({
        error: "No tienes permiso para eliminar este artículo",
      });
    }

    await pool.execute("DELETE FROM articles WHERE id = ?", [req.params.id]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, update, remove };
