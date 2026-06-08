const pool = require("../db/connection");

async function getCategories(req, res, next) {
  try {
    const [rows] = await pool.execute("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, slug } = req.body;
    const role = req.user?.role ?? null;

    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "No tienes permiso para editar esta categoria",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO categories (name, slug) VALUES (?, ?)",
      [name, slug],
    );
    const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    const category = rows[0];

    const role = req.user?.role;

    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "No tienes permiso para editar esta categoria",
      });
    }

    await pool.execute(
      `UPDATE categories
       SET name = ?, slug = ?
       WHERE id = ?`,
      [name ?? category.name, slug ?? category.slug, id],
    );

    const [updated] = await pool.execute(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );

    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
}

async function removeCategory(req, res, next) {
  try {
    const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    const category = rows[0];

    const role = req.user?.role;
    const userId = Number(req.user?.id);
    const ownerId = Number(category.author_id);

    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "No tienes permiso para eliminar este artículo",
      });
    }

    await pool.execute("DELETE FROM categories WHERE id = ?", [req.params.id]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,
};
