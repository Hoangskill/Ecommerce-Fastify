const { prisma } = require('../config/database');
const { redis } = require('../config/redis');

async function createProduct({ name, price, stock, categoryId }) {
    // Tạo sản phẩm mới
  const product = await prisma.product.create({
    // Dữ liệu của sản phẩm
    data: { name, price, stock, categoryId },
  });
  await redis.del('products'); // Xóa cache
  return product;
}

async function getAllProducts() {

// Kiểm tra cache
  const cached = await redis.get('products');
  if (cached) {
    return JSON.parse(cached);
  }
// Nếu không có cache thì lấy từ database
  const products = await prisma.product.findMany({
    include: { category: true },
  });

// Lưu vào cache và set expire time là 1 giờ
  await redis.setex('products', 3600, JSON.stringify(products));
  return products;
}

async function updateProduct(productId, { name, price, stock, categoryId }) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? price : undefined,
        stock: stock !== undefined ? stock : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
      },
    });
    await redis.del('products'); // Xóa cache
    return product;
}

async function deleteProduct(productId) {
    const product = await prisma.product.delete({
      where: { id: productId },
    });
    await redis.del('products'); // Xóa cache
    return product;
  }


module.exports = { createProduct, getAllProducts, updateProduct, deleteProduct };