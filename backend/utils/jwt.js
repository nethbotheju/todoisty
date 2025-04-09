const jwt = require("jsonwebtoken");

const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY, "base64").toString(
  "utf8"
);
const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY, "base64").toString(
  "utf8"
);

const generateAccessToken = (user) => {
  return jwt.sign(user, privateKey, {
    algorithm: "RS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = async (user, deviceId, redisClient) => {
  const refreshToken = jwt.sign(user, privateKey, {
    algorithm: "RS256",
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  await redisClient.setex(
    `refresh:${user.email}:${deviceId}`,
    7 * 24 * 60 * 60,
    refreshToken
  );
  return refreshToken;
};

const verifyToken = (token, req, res, next) => {
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
