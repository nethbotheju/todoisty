const Redis = require("ioredis");

const redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {},
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;
