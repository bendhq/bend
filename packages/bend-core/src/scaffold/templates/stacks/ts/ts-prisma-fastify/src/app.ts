import fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import compress from '@fastify/compress';
import logger from './config/logger';
import healthRoutes from './routes/health.routes';

const app = fastify({
  logger: false
});

app.register(helmet);
app.register(cors);
app.register(compress);
app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

app.register(healthRoutes, { prefix: '/api/v1/health' });

app.setErrorHandler((error, request, reply) => {
  logger.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || 'Server Error'
  });
});

export default app;