const express = require("express")

const router = express.Router()

const {
  getReflectionQuestions,
  startReflectionAnalysis,
  getReflectionStatus
} = require("../controllers/reflectionController")

const {
  protect
} = require("../auth/authMiddleware")

router.get(
  "/questions",
  protect,
  getReflectionQuestions
)

router.post(
  "/analyze",
  protect,
  startReflectionAnalysis
)

router.get(
  "/status/:id",
  protect,
  getReflectionStatus
)

module.exports = router