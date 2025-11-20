import app from './app';
import logger from './config/logger';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Test Prisma connection
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    logger.info(`Server running on port ${PORT}`);
  } catch (err) {
    logger.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();