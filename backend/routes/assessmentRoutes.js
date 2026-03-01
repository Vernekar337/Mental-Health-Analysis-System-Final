const express = require("express")
const { createAssessment } = require("../controllers/assessmentController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.post("/", protect, authorize(["student"]), createAssessment)

module.exports = router
