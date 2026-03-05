const express = require("express")
const router = express.Router()

const { protect } = require("../auth/authMiddleware")
const role = require("../middlewares/role")

const {
  getParentAlerts,
  acknowledgeAlert
} = require("../controllers/alertController")

router.get(
  "/parent/alerts",
  protect,
  role("parent"),
  getParentAlerts
)

router.patch(
  "/parent/alerts/:id",
  protect,
  role("parent"),
  acknowledgeAlert
)

module.exports = router