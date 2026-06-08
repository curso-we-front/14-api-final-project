const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/categories");
const { requireAuth } = require("../middleware/auth");
const { validateCategory } = require("../middleware/validate");

router.get("/", getCategories);
router.post("/", requireAuth, requireRole("admin", "editor"), validateCategory, createCategory);
router.patch("/:id", requireAuth, validateCategory, updateCategory);
router.delete("/:id", requireAuth, removeCategory);

module.exports = router;
