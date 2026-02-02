const ActivityLog = require("../models/ActivityLog")


exports.createActivityLog = async (req, res) => {
  const { activityType, durationMinutes, notes, date } = req.body

  if (!activityType || !date) {
    return res.status(400).json({
      message: "activityType and date are required"
    })
  }

  const activity = await ActivityLog.create({
    userId: req.user._id,
    activityType,
    durationMinutes,
    notes,
    date
  })

  res.status(201).json(activity)
}


exports.getActivityLogs = async (req, res) => {
  const activities = await ActivityLog.find({
    userId: req.user._id
  }).sort({ date: -1 })

  res.json(activities)
}


exports.getActivityByDateRange = async (req, res) => {
  const { from, to } = req.query

  if (!from || !to) {
    return res.status(400).json({
      message: "from and to dates are required"
    })
  }

  const activities = await ActivityLog.find({
    userId: req.user._id,
    date: {
      $gte: new Date(from),
      $lte: new Date(to)
    }
  }).sort({ date: 1 })

  res.json(activities)
}
