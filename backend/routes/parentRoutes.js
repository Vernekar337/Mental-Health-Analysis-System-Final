const express = require("express")
const router = express.Router()

const { getParentRecommendations, linkChild, getChildReport, getLinkedChildren, updateChildVisibility } = require("../controllers/parentController")
const { protect, authorize } = require("../auth/authMiddleware")

// Only parent role allowed
router.patch(
  "/child-visibility",
  protect,
  authorize(["parent"]),
  updateChildVisibility
)

router.get(
  "/children",
  protect,
  authorize(["parent"]),
  getLinkedChildren
)

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