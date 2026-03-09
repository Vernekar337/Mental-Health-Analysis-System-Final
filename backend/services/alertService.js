const Alert = require("../models/Alert")
const User = require("../models/User")

const evaluateAlerts = async (studentId, severity, mhIndex) => {

  try {

    const student = await User.findById(studentId)

    if (!student || !student.parentId) return

    // 🔹 Case 1: Critical MH Index
    if (mhIndex !== undefined && mhIndex < 40) {

      await Alert.create({
        studentId: student._id,
        parentId: student.parentId,
        severity: "High",
        message:
          "Student mental health index has dropped significantly. Immediate attention recommended."
      })

    }

    // 🔹 Case 2: Severe assessment
    if (severity === "Severe") {

      await Alert.create({
        studentId: student._id,
        parentId: student.parentId,
        severity: "Severe",
        message:
          "Severe mental health risk detected. Please review your child's report."
      })

    }

  } catch (error) {

    console.error("Alert evaluation failed:", error)

  }

}

module.exports = { evaluateAlerts }