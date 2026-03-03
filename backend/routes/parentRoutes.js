const express = require("express")
const router = express.Router()

const { getParentRecommendations } = require("../controllers/parentController")
const { protect, authorize } = require("../auth/authMiddleware")

// Only parent role allowed
router.get(
  "/recommendations/:childId",
  protect,
  authorize(["parent"]),
  getParentRecommendations
)

module.exports = router