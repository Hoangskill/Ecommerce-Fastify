const { prisma } = require('../config/database');

async function createRole({ name }) {
  const role = await prisma.role.create({
    data: { name },
  });
  return role;
}

async function getAllRoles() {
  const roles = await prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
  });
  return roles;
}

module.exports = {
  createRole,
  getAllRoles,
};