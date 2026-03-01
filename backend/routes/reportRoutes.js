const express = require("express")
const router = express.Router()

const { getLatestReport } = require("../controllers/reportController")
const { protect } = require("../auth/authMiddleware")

router.get("/latest", protect, getLatestReport)

module.exports = router