const { addToCart, getCart, removeFromCart } = require('../services/cart.service');

async function addToCartHandler(request, reply) {
  const userId = request.user.id; // Sửa từ const { userId } thành request.user.id

  if (!userId) {
    console.error('User ID not found in request.user:', request.user);
    return reply.code(401).send({ message: 'Unauthorized: User ID not found' });
  }

  const { productId, quantity } = request.body;

  if (!productId || !quantity || quantity <= 0) {
    return reply.code(400).send({ message: 'Product ID and quantity are required' });
  }

  try {
    const cartItem = await addToCart(userId, productId, quantity);
    return reply.code(201).send(cartItem);
  } catch (error) {
    console.error('Error in addToCartHandler:', error.message);
    return reply.code(400).send({ message: error.message });
  }
}

async function getCartHandler(request, reply) {
  const userId = request.user.id; // Sửa từ const { userId } thành request.user.id

  if (!userId) {
    console.error('User ID not found in request.user:', request.user);
    return reply.code(401).send({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const cartItems = await getCart(userId);
    return reply.send(cartItems);
  } catch (error) {
    console.error('Error in getCartHandler:', error.message);
    return reply.code(400).send({ message: error.message });
  }
}

async function removeFromCartHandler(request, reply) {
  const userId = request.user.id; // Sửa từ const { userId } thành request.user.id
  const { productId } = request.params;

  if (!userId) {
    console.error('User ID not found in request.user:', request.user);
    return reply.code(401).send({ message: 'Unauthorized: User ID not found' });
  }

  if (!productId) {
    return reply.code(400).send({ message: 'Product ID is required' });
  }

  try {
    const result = await removeFromCart(userId, productId);
    return reply.send(result);
  } catch (error) {
    console.error('Error in removeFromCartHandler:', error.message);
    return reply.code(400).send({ message: error.message });
  }
}

module.exports = { addToCartHandler, getCartHandler, removeFromCartHandler };