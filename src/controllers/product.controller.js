const { createProduct, getAllProducts, updateProduct,deleteProduct } = require('../services/product.service');

async function createProductHandler(request, reply) {
  const { name, price, stock, categoryId } = request.body;
  try {
    const product = await createProduct({ name, price, stock, categoryId });
    return reply.code(201).send(product);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function getProducts(request, reply) {
  try {
    const products = await getAllProducts();
    return reply.send(products);
  } catch (error) {
    return reply.code(500).send({ message: error.message });
  }
}

async function updateProductHandler(request, reply) {
    const { id } = request.params;
    const { name, price, stock, categoryId } = request.body;
    try {
      const product = await updateProduct(id, { name, price, stock, categoryId });
      return reply.send(product);
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }
  
  async function deleteProductHandler(request, reply) {
    const { id } = request.params;
    try {
      const product = await deleteProduct(id);
      return reply.send({ message: 'Product deleted', product });
    } catch (error) {
      return reply.code(400).send({ message: error.message });
    }
  }

module.exports = { createProductHandler, getProducts, updateProductHandler, deleteProductHandler };