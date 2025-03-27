const { registerUser, loginUser, logoutUser, refreshToken, forgotPassword,resetPassword } = require('../services/auth.service');

async function register(request, reply) {
  const { name, email, password } = request.body;
  try {
    const user = await registerUser(name, email, password);
    return reply.code(201).send({ message: 'User registered', userId: user.id });
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function login(request, reply) {
  const { email, password } = request.body;
  try {
    const tokens = await loginUser(email, password);
    return reply.send(tokens);
  } catch (error) {
    return reply.code(401).send({ message: error.message });
  }
}

async function logout(request, reply) {
  const { refreshToken } = request.body;
  const userId = request.user.id;
  try {
    await logoutUser(userId, refreshToken);
    return reply.send({ message: 'Logged out successfully' });
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function refresh(request, reply) {
  const { refreshToken } = request.body;
  try {
    const tokens = await refreshToken(refreshToken);
    return reply.send(tokens);
  } catch (error) {
    return reply.code(401).send({ message: error.message });
  }
}

// Thêm handler quên mật khẩu
async function forgotPasswordHandler(request, reply) {
  const { email } = request.body;
  try {
    const result = await forgotPassword(email);
    return reply.send(result);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function resetPasswordHandler(request, reply) {
  const { resetToken, newPassword } = request.body;
  try {
    const result = await resetPassword(resetToken, newPassword);
    return reply.send(result);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

module.exports = { register, login, logout, refresh, forgotPasswordHandler, resetPasswordHandler };