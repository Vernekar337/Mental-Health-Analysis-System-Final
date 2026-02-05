const express = require("express")
const { getStudentReport } = require("../controllers/reportController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.get(
  "/student",
  protect,
  authorize(["student"]),
  getStudentReport
)

module.exports = router
