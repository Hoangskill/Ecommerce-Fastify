const { prisma } = require('../config/database');
const { redis } = require('../config/redis');

async function addToCart(userId, productId, quantity) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');

  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId,
      productId,
      quantity,
    },
    include: { product: true },
  });

  await updateCartCache(userId);

  return cartItem;
}

async function getCart(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const cartKey = `cart:${userId}`;
  let cachedCart;
  try {
    cachedCart = await redis.get(cartKey);
    if (cachedCart) {
      console.log('Cart retrieved from Redis');
      return JSON.parse(cachedCart);
    }
  } catch (error) {
    console.error('Error retrieving cart from Redis:', error.message);
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  try {
    await redis.set(cartKey, JSON.stringify(cartItems), 'EX', 3600);
    console.log('Cart retrieved from database and cached in Redis');
  } catch (error) {
    console.error('Error saving cart to Redis:', error.message);
  }

  return cartItems;
}

async function removeFromCart(userId, productId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId');
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (!cartItem) throw new Error('Cart item not found');

  await prisma.cartItem.delete({
    where: { id: cartItem.id },
  });

  await updateCartCache(userId);

  return { message: 'Cart item removed' };
}

async function updateCartCache(userId) {
  const cartKey = `cart:${userId}`;
  const updatedCart = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  try {
    await redis.set(cartKey, JSON.stringify(updatedCart), 'EX', 3600);
  } catch (error) {
    console.error('Error saving cart to Redis:', error.message);
    throw new Error(`Failed to save cart to Redis: ${error.message}`);
  }
}

module.exports = { addToCart, getCart, removeFromCart };
