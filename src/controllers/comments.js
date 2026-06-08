const pool = require("../db/connection");

async function getComments(req, res, next) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM comments WHERE article_id = ?",
      [id],
    );

    const parentComments = rows.filter((comment) => comment.parent_id === null);

    const comments = parentComments.map((comment) => ({
      ...comment,
      replies: rows.filter((reply) => reply.parent_id === comment.id),
    }));

    res.json(comments);
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content, parent_id = null } = req.body;
    const userId = req.user?.id;

    if (!content) {
      return res.status(400).json({
        error: "El contenido es obligatorio",
      });
    }

    if (parent_id !== null) {
      const [rows] = await pool.execute("SELECT * FROM comments WHERE id = ?", [
        parent_id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          error: "Comentario padre no encontrado",
        });
      }

      if (rows[0].parent_id !== null) {
        return res.status(400).json({
          error: "Solo se permite un nivel de respuestas",
        });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO comments (article_id, user_id, parent_id, content)
       VALUES (?, ?, ?, ?)`,
      [id, userId, parent_id, content],
    );

    res.status(201).json({
      message: "Comentario creado",
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
}

async function updateComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "El contenido es obligatorio",
      });
    }

    const [rows] = await pool.execute("SELECT * FROM comments WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Comentario no encontrado",
      });
    }

    await pool.execute("UPDATE comments SET content = ? WHERE id = ?", [
      content,
      id,
    ]);

    res.json({
      message: "Comentario actualizado",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute("SELECT * FROM comments WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Comentario no encontrado",
      });
    }

    const comment = rows[0];

    const userId = Number(req.user?.id);
    const role = req.user?.role;

    if (comment.user_id !== userId && role !== "admin") {
      return res.status(403).json({
        error: "No tienes permiso para eliminar este comentario",
      });
    }

    await pool.execute("DELETE FROM comments WHERE id = ?", [id]);

    res.json({
      message: "Comentario eliminado",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getComments, createComment, updateComment, deleteComment };
