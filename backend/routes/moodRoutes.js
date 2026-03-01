const express = require("express")
const { authUser } = require("../middlewares/authMiddleware")
const {
  createMoodEntry,
  getMoodEntries,
  getMoodByDateRange
} = require("../controllers/moodController")

const router = express.Router()

router.post("/", authUser, createMoodEntry)
router.get("/", authUser, getMoodEntries)
router.get("/range", authUser, getMoodByDateRange)

module.exports = router
