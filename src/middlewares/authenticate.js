const fp = require('fastify-plugin');
const { verifyToken } = require('../utils/jwt');

module.exports = fp(async (fastify, opts) => {
    //Thêm phương thức authenticate vào fastify
  fastify.decorate('authenticate', async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ message: 'Authentication required' });
    }

    try {
    // Verify token: Giaỉ mã token, nếu token hợp lệ thì trả về dữ liệu
    // trong token, ngược lại nếu token không hợp lệ thì trả về lỗi 401
      const decoded = await verifyToken(token, process.env.JWT_ACCESS_SECRET);
      request.user = decoded;
    } catch (error) {
      return reply.code(401).send({ message: 'Invalid token' });
    }
  });
});