const User = require("../models/User")
const { hashPassword, comparePassword } = require("../utils/hashPassword")
const generateToken = require("../utils/generateToken")

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const user = await User.create({
    name,
    email,
    password: await hashPassword(password)
  })

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted
    },
    token: generateToken(user._id)
  })
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select("+password")

  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted
    },
    token: generateToken(user._id)
  })
}
