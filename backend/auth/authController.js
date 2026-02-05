const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { generateToken } = require("./jwt")

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    })
  }

  const token = generateToken(user._id)

  res.json({
    success: true,
    token
  })
}

module.exports = { login }
