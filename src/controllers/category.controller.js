const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    searchCategories,
  } = require('../services/category.service');
  
  async function createCategoryHandler(request, reply) {
    const { name } = request.body;
    try {
      const category = await createCategory({ name });
      return reply.code(201).send(category);
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  async function getCategories(request, reply) {
    try {
      const categories = await getAllCategories();
      return reply.send(categories);
    } catch (error) {
      return reply.code(500).send({ message: error.message });
    }
  }
  
  async function getCategoryByIdHandler(request, reply) {
    const { id } = request.params;
    try {
      const category = await getCategoryById(id);
      return reply.send(category);
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  async function updateCategoryHandler(request, reply) {
    const { id } = request.params;
    const { name } = request.body;
    try {
      const category = await updateCategory(id, { name });
      return reply.send(category);
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  async function deleteCategoryHandler(request, reply) {
    const { id } = request.params;
    try {
      const category = await deleteCategory(id);
      return reply.send({ message: 'Category deleted', category });
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  async function searchCategoriesHandler(request, reply) {
    const { query } = request.query;
    try {
      const categories = await searchCategories(query);
      return reply.send(categories);
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  module.exports = {
    createCategoryHandler,
    getCategories,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    searchCategoriesHandler,
  };