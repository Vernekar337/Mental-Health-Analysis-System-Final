const express = require("express")
const router = express.Router()

const { getPublicCases } = require("../controllers/counselorController")

const { protect, authorize } = require("../auth/authMiddleware")
const {
  writeSuggestion,
  getStudentSuggestions
} = require("../controllers/counselorController")

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

module.exports = router