const { prisma } = require('../config/database');

async function createCategory({ name }) {
  const category = await prisma.category.create({
    data: { name },
  });
  return category;
}

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });
  return categories;
}

async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
}

async function updateCategory(id, { name }) {
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  return category;
}

async function deleteCategory(id) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new Error('Category not found');
  }
  await prisma.category.delete({
    where: { id },
  });
  return category;
}

async function searchCategories(query) {
  const categories = await prisma.category.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: { products: true },
  });
  return categories;
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategories,
};