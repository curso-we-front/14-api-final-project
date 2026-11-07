const { Router } = require("express")
const { getAll, getOne, create, update, remove } = require("../controllers/categories")
const { requireAuth } = require("../middlewares/auth")
const { authorize } = require("../middlewares/authorize")
const router = Router()
const { validateBody, categorySchema } = require("../middlewares/validate")
const { publicLimit } = require("../middlewares/rateLimit")

router.get("/", publicLimit, getAll)
router.get("/:id", publicLimit, getOne)
router.post("/", requireAuth, authorize("admin", "editor"), validateBody(categorySchema), create)
router.patch(
  "/:id",
  requireAuth,
  authorize("admin", "editor"),
  validateBody(categorySchema),
  update,
)
router.delete("/:id", requireAuth, authorize("admin", "editor"), remove)

module.exports = router
