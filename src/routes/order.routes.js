const { createOrderHandler, getUserOrdersHandler } = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

module.exports = async function orderRoutes(fastify, opts) {
  fastify.post('/orders', {
    preHandler: [fastify.authenticate],
    handler: createOrderHandler,
  });

  fastify.get('/orders', {
    preHandler: [fastify.authenticate],
    handler: getUserOrdersHandler,
  });
};