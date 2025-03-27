const { createRolePermissionHandler, getRolePermissionsHandler } = require('../controllers/rolePermission.controller');
const authorize = require('../middlewares/authorize');

module.exports = async function (fastify, opts) {
  fastify.post('/role-permissions', {
    preHandler: [fastify.authenticate, authorize(['manage_role_permissions'])],
    handler: createRolePermissionHandler,
  });

  fastify.get('/role-permissions', {
    preHandler: [fastify.authenticate, authorize(['view_role_permissions'])],
    handler: getRolePermissionsHandler,
  });
};