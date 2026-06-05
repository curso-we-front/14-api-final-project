const express = require("express");
const router = express.Router();
const { getAll, create, update, remove } = require("../controllers/articles");
const { requireAuth } = require("../middleware/auth");
const { validateArticle } = require("../middleware/validate");

router.get("/", getAll);
router.post("/", requireAuth, validateArticle, create);
router.delete("/:id", requireAuth, validateArticle, remove);
router.patch("/:id", requireAuth, update);

module.exports = router;
