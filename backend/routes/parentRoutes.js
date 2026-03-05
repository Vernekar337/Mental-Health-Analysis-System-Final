const express = require("express")
const router = express.Router()

const { getParentRecommendations, linkChild, getChildReport } = require("../controllers/parentController")
const { protect, authorize } = require("../auth/authMiddleware")

// Only parent role allowed
router.get(
  "/recommendations/:childId",
  protect,
  authorize(["parent"]),
  getParentRecommendations
)

router.get(
  "/report",
  protect,
  authorize(["parent"]),
  getChildReport
)

router.post(
  "/link-child",
  protect,
  authorize(["parent"]),
  linkChild
)
module.exports = router