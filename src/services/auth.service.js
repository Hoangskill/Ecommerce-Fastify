const { prisma } = require('../config/database');
const { redis } = require('../config/redis');
const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../utils/jwt');
const transporter = require('../config/email');
const crypto = require('crypto');


const MAX_SESSIONS = 5; // Giới hạn tối đa 5 phiên

async function registerUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  return user;
}

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  // Kiểm tra số phiên hiện tại
  const currentTokens = await prisma.refreshToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }, // Sắp xếp theo thời gian tạo
  });

  if (currentTokens.length >= MAX_SESSIONS) {
    // Xóa phiên cũ nhất
    const oldestToken = currentTokens[0];
    await prisma.refreshToken.delete({ where: { id: oldestToken.id } });
    await redis.del(`refresh:${oldestToken.token}`);
  }

  // Tạo token mới
  const accessToken = signToken({ id: user.id }, process.env.JWT_ACCESS_SECRET, '15m');
  const refreshToken = signToken({ id: user.id }, process.env.JWT_REFRESH_SECRET, '7d');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Lưu Refresh Token với key riêng
  await redis.set(`refresh:${refreshToken}`, user.id, 'EX', 7 * 24 * 60 * 60);

  return { accessToken, refreshToken };
}

async function logoutUser(userId, refreshToken) {
  await prisma.refreshToken.deleteMany({ where: { userId, token: refreshToken } });
  await redis.del(`refresh:${refreshToken}`);
}

async function refreshToken(refreshToken) {
  console.log('Received refreshToken:', refreshToken); // Kiểm tra giá trị nhận được
  const userId = await redis.get(`refresh:${refreshToken}`);
  console.log('Redis userId:', userId); // Kiểm tra Redis
  if (!userId) throw new Error('Invalid refresh token');

  const storedToken = await prisma.refreshToken.findFirst({ where: { token: refreshToken } });
  console.log('Stored token in DB:', storedToken); // Kiểm tra database
  if (!storedToken || storedToken.userId !== userId) throw new Error('Invalid refresh token');

  const decoded = await verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  console.log('Decoded token:', decoded); // Kiểm tra JWT
  const newAccessToken = signToken({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, '15m');
  return { accessToken: newAccessToken };
}


// Thêm hàm quên mật khẩu
async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenKey = `reset:${resetToken}`;
  const resetTokenTTL = 15 * 60; // 15 phút

  await redis.set(resetTokenKey, user.id, 'EX', resetTokenTTL);

  const mailOptions = {
    from: 'no-reply@yourdomain.com',
    to: email,
    subject: 'Password Reset Request',
    text: `Your password reset token is: ${resetToken}\nThis token is valid for 15 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  return { message: 'Reset token sent to your email' };
}

async function resetPassword(resetToken, newPassword) {
  const resetTokenKey = `reset:${resetToken}`;
  const userId = await redis.get(resetTokenKey);

  if (!userId) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await redis.del(resetTokenKey);

  // Xóa tất cả Refresh Token để buộc đăng nhập lại
  await prisma.refreshToken.deleteMany({ where: { userId } });
  const refreshKeys = await redis.keys(`refresh:*`);
  for (const key of refreshKeys) {
    const storedUserId = await redis.get(key);
    if (storedUserId === userId) {
      await redis.del(key);
    }
  }

  return { message: 'Password reset successfully' };
}

module.exports = { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, resetPassword };