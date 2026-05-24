// In backend/routes/alertRoutes.js — REPLACE ENTIRE FILE:
const express = require("express")
const router = express.Router()

const { authUser } = require("../middlewares/authMiddleware")
const role = require("../middlewares/role")

const {
  getParentAlerts,
  acknowledgeAlert
} = require("../controllers/alertController")

router.get(
  "/parent/alerts",
  authUser,
  role("parent"),
  getParentAlerts
)

router.patch(
  "/parent/alerts/:id",
  authUser,
  role("parent"),
  acknowledgeAlert
)

module.exports = router