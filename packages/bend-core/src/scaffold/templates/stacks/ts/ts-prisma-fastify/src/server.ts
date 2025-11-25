import dotenv from 'dotenv';
import app from './app';
import logger from './config/logger';
import { prisma } from './config/prisma';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // Start server
    await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      try {
        await app.close();
        logger.info('Fastify server closed');
        
        await prisma.$disconnect();
        logger.info('Database connection closed');
        
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

start();