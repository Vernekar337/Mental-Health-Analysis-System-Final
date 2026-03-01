const express = require("express")
const router = express.Router()

const { getStudentDashboard } = require("../controllers/dashboardController")
const { protect } = require("../auth/authMiddleware")

router.get("/student", protect, getStudentDashboard)

module.exports = router