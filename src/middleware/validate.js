function validateUser(req, res, next) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "username, email y password son obligatorios",
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      error: "username debe tener al menos 3 caracteres",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "password debe tener al menos 6 caracteres",
    });
  }

  if (role && !["admin", "editor", "author", "reader"].includes(role)) {
    return res.status(400).json({
      error: "role no válido",
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "email y password son obligatorios",
    });
  }

  next();
}

function validateArticle(req, res, next) {
  const { title, content, slug, status } = req.body;

  if (!title || !content || !slug) {
    return res.status(400).json({
      error: "title, content y slug son obligatorios",
    });
  }

  if (title.length < 5) {
    return res.status(400).json({
      error: "title debe tener al menos 5 caracteres",
    });
  }

  if (content.length < 10) {
    return res.status(400).json({
      error: "content debe tener al menos 10 caracteres",
    });
  }

  if (status && !["draft", "published", "archived"].includes(status)) {
    return res.status(400).json({
      error: "status no válido",
    });
  }

  next();
}
function validateCategory(req, res, next) {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({
      error: "name y slug son obligatorios",
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      error: "name debe tener al menos 2 caracteres",
    });
  }

  if (slug.includes(" ")) {
    return res.status(400).json({
      error: "slug no puede contener espacios",
    });
  }

  next();
}

function validateComment(req, res, next) {
  const { content, parent_id } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "content es obligatorio",
    });
  }

  if (content.length < 2) {
    return res.status(400).json({
      error: "content debe tener al menos 2 caracteres",
    });
  }

  if (parent_id != null && typeof parent_id !== "number") {
    return res.status(400).json({
      error: "parent_id debe ser un número",
    });
  }

  next();
}

function validateArticleCategory(req, res, next) {
  const { article_id, category_id } = req.body;

  if (!article_id || !category_id) {
    return res.status(400).json({
      error: "article_id y category_id son obligatorios",
    });
  }

  if (isNaN(article_id) || isNaN(category_id)) {
    return res.status(400).json({
      error: "IDs deben ser números",
    });
  }

  next();
}

module.exports = {
  validateUser,
  validateLogin,
  validateArticle,
  validateCategory,
  validateComment,
  validateArticleCategory,
};
