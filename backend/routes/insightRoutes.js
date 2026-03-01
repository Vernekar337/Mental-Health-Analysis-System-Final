const express = require("express")
const router = express.Router()

const { getInsights } = require("../controllers/insightController")
const { protect } = require("../auth/authMiddleware")

router.get("/", protect, getInsights)

module.exports = router