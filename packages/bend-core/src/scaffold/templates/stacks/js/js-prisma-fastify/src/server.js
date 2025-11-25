import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import logger from './config/logger.js';
import { prisma } from './config/prisma.js';
import config from './config/index.js';

const PORT = config.port;

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  } catch (err) {
    logger.error('Failed to start server', err);
    await prisma.$disconnect();
    process.exit(1);
  }

  const graceful = async (signal) => {
    try {
      logger.warn(`Received ${signal} — closing server`);
      await app.close();
      logger.info('Fastify server closed');
      await prisma.$disconnect();
      logger.info('Shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error('Graceful shutdown failed', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => graceful('SIGINT'));
  process.on('SIGTERM', () => graceful('SIGTERM'));
  
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { message: err.message, stack: err.stack });
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    process.exit(1);
  });
}

start();