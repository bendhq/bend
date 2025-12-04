import { FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';

export const checkHealth = async (_req: FastifyRequest, reply: FastifyReply) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  reply.send({
    success: true,
    message: 'Server is healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};