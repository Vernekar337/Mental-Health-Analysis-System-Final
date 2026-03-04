const User = require("../models/User")

const toggleProfileVisibility = async (req, res) => {

  try {

    const parentId = req.user._id
    const { isPublic } = req.body

    const student = await User.findOne({
      parentId: parentId,
      role: "student"
    })

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No child linked"
      })
    }

    student.isProfilePublic = isPublic
    await student.save()

    res.json({
      success: true,
      isProfilePublic: student.isProfilePublic
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    })

  }

}

module.exports = { toggleProfileVisibility }