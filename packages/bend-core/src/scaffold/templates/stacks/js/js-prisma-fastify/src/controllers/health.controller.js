import { prisma } from '../config/prisma.js';

export const checkHealth = async (req, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    reply.send({
      success: true,
      message: 'Server is healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    reply.code(503).send({
      success: false,
      message: 'Database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
};