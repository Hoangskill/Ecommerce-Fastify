const { createPermissionHandler, getAllPermissionsHandler } = require('../controllers/permission.controller');
const authorize = require('../middlewares/authorize');

module.exports = async function (fastify, opts) {
  fastify.post('/permissions', {
    preHandler: [fastify.authenticate, authorize(['manage_permissions'])],
    handler: createPermissionHandler,
  });

  fastify.get('/permissions', {
    preHandler: [fastify.authenticate, authorize(['view_permissions'])],
    handler: getAllPermissionsHandler,
  });
};