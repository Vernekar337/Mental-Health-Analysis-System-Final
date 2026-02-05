const CaseFile = require("../models/CaseFile")
const Alert = require("../models/Alert")
const User = require("../models/User")

// GET /api/counselor/cases
const getPendingCases = async (req, res) => {
  const cases = await CaseFile.find({
    status: "Pending"
  })
    .populate("userId", "name email age")
    .sort({ createdAt: -1 })

  res.json({
    data: cases
  })
}

// POST /api/counselor/cases/:id/approve
const approveCase = async (req, res) => {
  const caseFile = await CaseFile.findById(req.params.id)

  if (!caseFile) {
    return res.status(404).json({
      success: false,
      message: "Case not found"
    })
  }

  caseFile.status = "Approved"
  caseFile.counselorId = req.user._id
  await caseFile.save()

  // Notify parents of the student
  const parents = await User.find({
    role: "parent",
    linkedStudentIds: caseFile.userId
  })

  for (const parent of parents) {
    await Alert.create({
      userId: caseFile.userId,
      triggeredBy: "Counselor review approved",
      severity: "Medium",
      message:
        "A counselor has reviewed and approved a mental health case for your child.",
      sentTo: parent.email
    })
  }

  res.json({ success: true })
}

module.exports = {
  getPendingCases,
  approveCase
}
