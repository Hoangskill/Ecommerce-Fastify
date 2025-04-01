const jwt = require('jsonwebtoken');

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error(error.message); // Trả về thông báo lỗi chi tiết
  }
};

module.exports = { signToken, verifyToken };