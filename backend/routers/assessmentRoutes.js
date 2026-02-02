const express = require("express")
const { authUser } = require("../middlewares/authMiddleware")
const {
  submitAssessment,
  getAssessmentsByType
} = require("../controllers/assessmentController")

const router = express.Router()

router.post("/", authUser, submitAssessment)
router.get("/:type", authUser, getAssessmentsByType)

module.exports = router
