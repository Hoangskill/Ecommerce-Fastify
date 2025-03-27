const { prisma } = require('../config/database');

async function createPermission({ name }) {
  const permission = await prisma.permission.create({
    data: { name },
  });
  return permission;
}

async function getAllPermissions() {
  const permissions = await prisma.permission.findMany();
  return permissions;
}

module.exports = {
  createPermission,
  getAllPermissions,
};