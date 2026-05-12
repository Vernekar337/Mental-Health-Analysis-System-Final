const Redis = require("ioredis")

const connection = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
})

connection.on("connect", () => {
  console.log("Redis connected")
})

connection.on("error", (err) => {
  console.error("Redis error:", err.message)
})

module.exports = connection