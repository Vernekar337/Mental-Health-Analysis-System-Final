const express = require("express")
const router = express.Router()

const { protect } = require("../auth/authMiddleware")

const {
  getDashboardReport,
  getHistory
} = require("../controllers/reportController")

router.get("/dashboard", protect, getDashboardReport)

router.get("/history", protect, getHistory)

module.exports = router