const express = require("express");
const router = express.Router();

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");

const { requireAuth } = require("../middleware/auth");
const { validateComment } = require("../middleware/validate");

// 👇 ahora la ruta base NO incluye "comments"
router.get("/articles/:id/comments", getComments);

router.post(
  "/articles/:id/comments",
  requireAuth,
  validateComment,
  createComment,
);

router.patch("/comments/:id", requireAuth, validateComment, updateComment);

router.delete("/comments/:id", requireAuth, deleteComment);

module.exports = router;
