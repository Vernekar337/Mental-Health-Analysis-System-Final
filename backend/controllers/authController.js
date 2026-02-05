const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { generateToken } = require("./jwt")

// POST /api/auth/register
const register = async (req, res) => {
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
}

module.exports = { login, register }
