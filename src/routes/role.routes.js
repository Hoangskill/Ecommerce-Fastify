const { createRoleHandler, getAllRolesHandler } = require('../controllers/role.controller');
const authorize = require('../middlewares/authorize');

module.exports = async function (fastify, opts) {
  fastify.post('/roles', {
    preHandler: [fastify.authenticate, authorize(['manage_roles'])],
    handler: createRoleHandler,
  });

  fastify.get('/roles', {
    preHandler: [fastify.authenticate, authorize(['view_roles'])],
    handler: getAllRolesHandler,
  });
};