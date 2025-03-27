const { prisma } = require('../config/database');

async function createRolePermission({ roleId, permissionId }) {
  const rolePermission = await prisma.rolePermission.create({
    data: {
      roleId,
      permissionId,
    },
  });
  return rolePermission;
}

async function getRolePermissions() {
  const rolePermissions = await prisma.rolePermission.findMany({
    include: {
      role: true,
      permission: true,
    },
  });
  return rolePermissions;
}

module.exports = {
  createRolePermission,
  getRolePermissions,
};