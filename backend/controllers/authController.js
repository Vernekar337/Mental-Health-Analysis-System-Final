const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { generateToken } = require("../auth/jwt")

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role, age } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    const allowedRoles = ["student", "parent", "counselor"]
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      age
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      token
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { register, login }