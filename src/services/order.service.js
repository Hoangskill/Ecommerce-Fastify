const { prisma } = require('../config/database');
const { redis } = require('../config/redis');

async function createOrder(userId, selectedItems) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    throw new Error('No items selected for checkout');
  }

  let total = 0;
  const orderItems = [];
  const productIds = selectedItems.map(item => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const productMap = new Map(products.map(product => [product.id, product]));

  for (const item of selectedItems) {
    const { productId, quantity } = item;
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }

    total += product.price * quantity;

    orderItems.push({
      productId,
      quantity,
      price: product.price,
    });
  }

  let newOrder;
  try {
    newOrder = await prisma.$transaction(async (tx) => {
      for (const item of selectedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      await tx.cartItem.deleteMany({
        where: {
          userId,
          productId: { in: productIds },
        },
      });

      return order;
    });
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  try {
    // Xóa cache giỏ hàng
    await redis.del(`cart:${userId}`);

    // Lấy đơn hàng mới nhất (thay vì lấy toàn bộ)
    const latestOrder = await prisma.order.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOrder) {
      await redis.set(`orders:${userId}`, JSON.stringify([latestOrder]), 'EX', 3600);
    }
  } catch (error) {
    console.error('Error updating cache:', error.message);
  }

  return newOrder;
}

async function getUserOrders(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const cacheKey = `orders:${userId}`;
  let cachedOrders;

  try {
    cachedOrders = await redis.get(cacheKey);
    if (cachedOrders) {
      return JSON.parse(cachedOrders);
    }
  } catch (error) {
    console.error('Error retrieving orders from Redis:', error.message);
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  try {
    await redis.set(cacheKey, JSON.stringify(orders), 'EX', 3600);
  } catch (error) {
    console.error('Error saving orders to Redis:', error.message);
  }

  return orders;
}

module.exports = { createOrder, getUserOrders };
