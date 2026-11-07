const { Router } = require("express")
const { getAll, create, remove } = require("../controllers/comments")
const { requireAuth } = require("../middlewares/auth")
const router = Router({ mergeParams: true })
const { validateBody, commentSchema } = require("../middlewares/validate")
const { publicLimit } = require("../middlewares/rateLimit")

router.get("/", publicLimit, getAll)
router.post("/", requireAuth, validateBody(commentSchema), create)
router.delete("/:commentId", requireAuth, remove)

module.exports = router
