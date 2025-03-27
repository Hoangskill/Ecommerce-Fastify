const { register, login, logout, refresh, forgotPasswordHandler,resetPasswordHandler } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authenticate');

module.exports = async function (fastify, opts) {
  fastify.post('/register', register);
  fastify.post('/login', login);
  fastify.post('/logout', { preHandler: [fastify.authenticate], handler: logout });
  fastify.post('/refresh', refresh);
  fastify.post('/forgot-password', forgotPasswordHandler);
  fastify.post('/reset-password', resetPasswordHandler);
};