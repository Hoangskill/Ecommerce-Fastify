const { addToCartHandler, getCartHandler, removeFromCartHandler } = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

module.exports = async function cartRoutes(fastify, opts) {
  // Thêm sản phẩm vào giỏ hàng
  fastify.post('/cart', {
    preHandler: [fastify.authenticate],
    handler: addToCartHandler,
  });

  // Lấy giỏ hàng
  fastify.get('/cart', {
    preHandler: [fastify.authenticate],
    handler: getCartHandler,
  });

  // Xóa sản phẩm khỏi giỏ hàng
  fastify.delete('/cart/:productId', {
    preHandler: [fastify.authenticate],
    handler: removeFromCartHandler,
  });
};