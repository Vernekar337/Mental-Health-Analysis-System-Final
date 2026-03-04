const express = require("express")
const router = express.Router()

const { toggleProfileVisibility } = require("../controllers/profileController")

const { protect, authorize } = require("../auth/authMiddleware")

router.patch(
  "/visibility",
  protect,
  authorize(["parent"]),
  toggleProfileVisibility
)

module.exports = router