const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Use -passwordHash to match what the User model stores
    req.user = await User.findById(decoded.id).select("-passwordHash")

    if (!req.user) {
      return res.status(401).json({ message: "User not found" })
    }

    next()

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}