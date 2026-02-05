const express = require("express")
const {
  getPendingReflectiveAssessment,
  submitReflectiveAssessment
} = require("../controllers/reflectiveAssessmentController")
const { protect, authorize } = require("../auth/authMiddleware")

const router = express.Router()

router.get(
  "/pending",
  protect,
  authorize(["student"]),
  getPendingReflectiveAssessment
)

router.post(
  "/submit",
  protect,
  authorize(["student"]),
  submitReflectiveAssessment
)

module.exports = router
