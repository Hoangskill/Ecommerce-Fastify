const {
    createCategoryHandler,
    getCategories,
    getCategoryByIdHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
    searchCategoriesHandler,
  } = require('../controllers/category.controller');
  const authorize = require('../middlewares/authorize');
  
  module.exports = async function (fastify, opts) {
    fastify.post('/categories', {
      preHandler: [fastify.authenticate, authorize(['create_category'])],
      handler: createCategoryHandler,
    });
  
    fastify.get('/categories', getCategories); // Công khai
  
    fastify.get('/categories/:id', getCategoryByIdHandler); // Công khai
  
    fastify.put('/categories/:id', {
      preHandler: [fastify.authenticate, authorize(['update_category'])],
      handler: updateCategoryHandler,
    });
  
    fastify.delete('/categories/:id', {
      preHandler: [fastify.authenticate, authorize(['delete_category'])],
      handler: deleteCategoryHandler,
    });
  
    fastify.get('/categories/search', {
      preHandler: [fastify.authenticate, authorize(['search_category'])],
      handler: searchCategoriesHandler,
    });
  };