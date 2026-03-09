const express = require("express")
const router = express.Router()

const { getPublicCases } = require("../controllers/counselorController")

const { protect, authorize } = require("../auth/authMiddleware")
const {
  writeSuggestion,
  getStudentSuggestions, getStudentCase, getAvailableCounselors, requestConsultation, getConsultationRequests, getParentConsultationRequests
} = require("../controllers/counselorController")

router.get(
  "/my-consultations",
  protect,
  authorize(["parent"]),
  getParentConsultationRequests
)

router.get(
  "/consultation-requests",
  protect,
  authorize(["counselor"]),
  getConsultationRequests
)

router.post(
  "/request-consultation",
  protect,
  authorize(["parent"]),
  requestConsultation
)

router.get(
  "/directory",
  protect,
  authorize(["parent"]),
  getAvailableCounselors
)

router.get(
  "/cases",
  protect,
  authorize(["counselor"]),
  getPublicCases
)

router.post(
  "/suggestion",
  protect,
  authorize(["counselor"]),
  writeSuggestion
)

router.get(
  "/suggestions",
  protect,
  authorize(["student"]),
  getStudentSuggestions
)

router.get(
  "/case/:studentId",
  protect,
  authorize(["counselor"]),
  getStudentCase
)

module.exports = router