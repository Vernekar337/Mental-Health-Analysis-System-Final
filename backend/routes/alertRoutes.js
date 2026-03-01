const express = require("express")
const { getParentAlerts } = require("../controllers/alertController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.get(
  "/parent",
  protect,
  authorize(["parent"]),
  getParentAlerts
)

module.exports = router
