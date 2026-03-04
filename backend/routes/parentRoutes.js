const express = require("express")
const router = express.Router()

const { getParentRecommendations, linkChild } = require("../controllers/parentController")
const { protect, authorize } = require("../auth/authMiddleware")

// Only parent role allowed
router.get(
  "/recommendations/:childId",
  protect,
  authorize(["parent"]),
  getParentRecommendations
)

router.post(
  "/link-child",
  protect,
  authorize(["parent"]),
  linkChild
)
module.exports = router