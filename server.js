const fastify = require('fastify')({ logger: true });
require('dotenv').config();

fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/helmet'));
fastify.register(require('@fastify/rate-limit'), { max: 100, timeWindow: '1 minute' });
fastify.register(require('./src/middlewares/authenticate'));

fastify.register(require('./src/routes/role.routes'), { prefix: '/api' });
fastify.register(require('./src/routes/auth.routes'), { prefix: '/api/auth' });
fastify.register(require('./src/routes/product.routes'), { prefix: '/api' });
fastify.register(require('./src/routes/category.routes'), { prefix: '/api' });
fastify.register(require('./src/routes/permission.routes'), { prefix: '/api' });
fastify.register(require('./src/routes/rolePermission.routes'), { prefix: '/api' });
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    fastify.log.info(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();