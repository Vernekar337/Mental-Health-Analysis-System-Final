const Alert = require("../models/Alert")
const User = require("../models/User")

const evaluateAlerts = async (studentId, severity) => {

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