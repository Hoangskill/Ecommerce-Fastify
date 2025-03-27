const { createRole, getAllRoles } = require('../services/role.service');

async function createRoleHandler(request, reply) {
  const { name } = request.body;
  if (!name) {
    return reply.code(400).send({ message: 'Role name is required' });
  }
  try {
    const role = await createRole({ name });
    return reply.code(201).send(role);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function getAllRolesHandler(request, reply) {
  try {
    const roles = await getAllRoles();
    return reply.send(roles);
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
}

module.exports = {
  createRoleHandler,
  getAllRolesHandler,
};