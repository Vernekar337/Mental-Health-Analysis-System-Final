const Alert = require("../models/Alert")
const CaseFile = require("../models/CaseFile")
const User = require("../models/User")

const evaluateAlerts = async (user, severityLevel) => {
  if (severityLevel !== "Severe") return

  const parents = await User.find({
    role: "parent",
    linkedStudentIds: user._id
  })

  for (const parent of parents) {
    await Alert.create({
      userId: user._id,
      triggeredBy: "High severity assessment",
      severity: "High",
      message:
        "A recent assessment indicates elevated mental health risk.",
      sentTo: parent.email
    })
  }

  await CaseFile.create({
    userId: user._id,
    triggerReason: "Severe assessment result"
  })
}

module.exports = { evaluateAlerts }
