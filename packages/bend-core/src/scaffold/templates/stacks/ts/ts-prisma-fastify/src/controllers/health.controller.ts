import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../config/prisma';

export const checkHealth = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Test database connection
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