const express = require("express")
const { authUser } = require("../middlewares/authMiddleware")
const {createActivityLog,getActivityLogs,getActivityByDateRange} = require("../controllers/activityController")

const router = express.Router()

router.post("/", authUser, createActivityLog)
router.get("/", authUser, getActivityLogs)
router.get("/range", authUser, getActivityByDateRange)

module.exports = router
