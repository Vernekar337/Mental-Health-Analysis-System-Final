const express = require("express")
const { authUser } = require("../middlewares/authMiddleware")
const {
  getWeeklyMoodAverage,
  getMoodDistribution,
  getActiveDaysCount,
  getAssessmentTrend,
  getActivityStreak,
  getMonthlySummary
} = require("../controllers/analyticsController")

const { analyticsLimiter } = require("../middlewares/rateLimiter")


const router = express.Router()

router.use(analyticsLimiter)
router.get("/mood/weekly", authUser, getWeeklyMoodAverage)
router.get("/mood/distribution", authUser, getMoodDistribution)
router.get("/activity/days-active", authUser, getActiveDaysCount)
router.get("/assessment/:type", authUser, getAssessmentTrend)
router.get("/activity/streak", authUser, getActivityStreak)
router.get("/summary/monthly", authUser, getMonthlySummary)



module.exports = router
