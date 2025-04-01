const fp = require('fastify-plugin');
const { verifyToken } = require('../utils/jwt');

module.exports = fp(async (fastify, opts) => {
  fastify.decorate('authenticate', async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ message: 'Authentication required' });
    }

    try {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET); // Xóa await vì verifyToken không phải async
      if (!decoded.id) {
        return reply.code(401).send({ message: 'Invalid token: User ID not found in token' });
      }
      request.user = decoded;
      console.log('Authenticated user:', request.user); // Debug
    } catch (error) {
      console.error('Authentication error:', error.message);
      return reply.code(401).send({ message: `Invalid token: ${error.message}` });
    }
  });
});