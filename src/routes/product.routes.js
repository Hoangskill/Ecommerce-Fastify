const { createProductHandler, getProducts,updateProductHandler,deleteProductHandler } = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

module.exports = async function (fastify, opts) {
  fastify.post('/products', {
    preHandler: [fastify.authenticate, authorize(['create_product'])],
    handler: createProductHandler,
  });

  fastify.get('/products', getProducts);

  fastify.put('/products/:id', {
    preHandler: [fastify.authenticate, authorize(['update_product'])],
    handler: updateProductHandler,
  });

  fastify.delete('/products/:id', {
    preHandler: [fastify.authenticate, authorize(['delete_product'])],
    handler: deleteProductHandler,
  });
  
};