const express = require("express");
const router = express.Router();
const { getAll, create, update, remove } = require("../controllers/articles");
const { requireAuth } = require("../middleware/auth");
const { validateArticle } = require("../middleware/validate");

router.get("/", getAll);
router.post("/", requireAuth, requireRole("admin", "editor"), validateArticle, create);
router.delete("/:id", requireAuth, requireRole("admin", "editor"), remove);
router.patch("/:id", requireAuth, requireRole("admin", "editor"), update);

module.exports = router;
