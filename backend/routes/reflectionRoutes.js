const express = require("express")
const router = express.Router()

const { getReflectionQuestions } = require("../controllers/reflectionController")
const { protect } = require("../auth/authMiddleware")


router.get(
  "/questions",
  protect,
  getReflectionQuestions
)


router.get("/", protect, getReflectionQuestions)

module.exports = router