const { createOrder, getUserOrders } = require('../services/order.service');

async function createOrderHandler(request, reply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized: User ID not found' });
  }

  const { selectedItems } = request.body;

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return reply.code(400).send({ message: 'No items selected for checkout' });
  }

  try {
    const order = await createOrder(userId, selectedItems);
    return reply.code(201).send(order);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

async function getUserOrdersHandler(request, reply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const orders = await getUserOrders(userId);
    return reply.code(200).send(orders);
  } catch (error) {
    return reply.code(400).send({ message: error.message });
  }
}

module.exports = { createOrderHandler, getUserOrdersHandler };
