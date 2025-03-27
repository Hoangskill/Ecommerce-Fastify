const { createPermission, getAllPermissions } = require('../services/permission.service');

async function createPermissionHandler(request, reply) {
  const { name } = request.body;
  if (!name) {
    return reply.code(400).send({ message: 'Permission name is required' });
  }
  try {
    const permission = await createPermission({ name });
    return reply.code(201).send(permission);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function getAllPermissionsHandler(request, reply) {
  try {
    const permissions = await getAllPermissions();
    return reply.send(permissions);
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
}

module.exports = {
  createPermissionHandler,
  getAllPermissionsHandler,
};