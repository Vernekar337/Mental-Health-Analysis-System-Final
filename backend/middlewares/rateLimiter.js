const rateLimit = require("express-rate-limit")

exports.analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many analytics requests, slow down"
})
