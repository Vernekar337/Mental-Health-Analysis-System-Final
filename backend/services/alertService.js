const Alert = require("../models/Alert")
const User = require("../models/User")
const { aggregateMentalSignals } =
require("./mentalSignalAggregator")

const evaluateAlerts = async (studentId, severity) => {
  const signals = await aggregateMentalSignals(userId)

if (signals.riskLevel === "high") {

  await Alert.create({
    userId,
    severity: "High",
    message: "High mental health risk detected from combined signals."
  })

}

  if (severity !== "Severe") return

  // find parent linked to student
  const parent = await User.findOne({
    role: "parent",
    linkedStudentIds: studentId
  })

  if (!parent) return

  await Alert.create({
    parentId: parent._id,
    studentId,
    severity,
    message: "Severe mental health risk detected. Please review your child's report."
  })

}

module.exports = { evaluateAlerts }