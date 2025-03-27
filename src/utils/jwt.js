const jwt = require('jsonwebtoken');

//Tạo token
//payload: Dữ liệu cần lưu trong token
//secret: Mã bí mật để tạo token
//expiresIn: Thời gian sống của token
const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

//Giải mã token
//token: Token cần giải mã
//secret: Mã bí mật để giải mã token
//Trả về dữ liệu trong token nếu token hợp lệ
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = { signToken, verifyToken };