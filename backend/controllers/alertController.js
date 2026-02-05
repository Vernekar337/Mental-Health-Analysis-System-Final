const Alert = require("../models/Alert")
const User = require("../models/User")

// GET /api/alerts/parent
const getParentAlerts = async (req, res) => {
  // Parent must have linked students
  const parent = await User.findById(req.user._id)

  if (!parent || !parent.linkedStudentIds) {
    return res.json({ data: [] })
  }

  const alerts = await Alert.find({
    userId: { $in: parent.linkedStudentIds }
  }).sort({ createdAt: -1 })

  res.json({
    data: alerts
  })
}

module.exports = { getParentAlerts }
