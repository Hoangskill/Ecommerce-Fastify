const { createRolePermission, getRolePermissions } = require('../services/rolePermission.service');

async function createRolePermissionHandler(request, reply) {
  const { roleId, permissionId } = request.body;
  if (!roleId || !permissionId) {
    return reply.code(400).send({ message: 'roleId and permissionId are required' });
  }
  try {
    const rolePermission = await createRolePermission({ roleId, permissionId });
    return reply.code(201).send(rolePermission);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function getRolePermissionsHandler(request, reply) {
  try {
    const rolePermissions = await getRolePermissions();
    return reply.send(rolePermissions);
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
}

module.exports = {
  createRolePermissionHandler,
  getRolePermissionsHandler,
};