const { Router } = require("express")
const { getAll, getOne, create, replace, update, remove } = require("../controllers/articles")
const { requireAuth } = require("../middlewares/auth")
const router = Router()
const { validateBody, articleSchema } = require("../middlewares/validate")
const { publicLimit } = require("../middlewares/rateLimit")
const { authorize } = require("../middlewares/authorize")

router.get("/", publicLimit, getAll)
router.get("/:id", publicLimit, getOne)
router.post("/", requireAuth, authorize("admin", "editor"), validateBody(articleSchema), create)
router.patch("/:id", requireAuth, validateBody(articleSchema), update)
router.put("/:id", requireAuth, validateBody(articleSchema), replace)
router.delete("/:id", requireAuth, remove)

module.exports = router
