const redis = require("../config/redis")

exports.cache = (keyBuilder, ttl = 60) => async (req, res, next) => {
  const key = keyBuilder(req)

  const cached = await redis.get(key)
  if (cached) {
    return res.json(JSON.parse(cached))
  }

  const originalJson = res.json.bind(res)
  res.json = async (data) => {
    await redis.set(key, JSON.stringify(data), "EX", ttl)
    originalJson(data)
  }

  next()
}
