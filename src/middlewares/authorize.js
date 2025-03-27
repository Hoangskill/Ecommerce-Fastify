const { prisma } = require('../config/database');

module.exports = (permissions = []) => {
  return async (request, reply) => {
    const userId = request.user.id;

    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    const userPermissions = new Set();
    userRoles.forEach((ur) =>
      ur.role.permissions.forEach((rp) => userPermissions.add(rp.permission.name))
    );

    const hasPermission = permissions.every((p) => userPermissions.has(p));
    if (!hasPermission) {
      return reply.code(403).send({ message: 'Forbidden: Insufficient permissions' });
    }
  };
};