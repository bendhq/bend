import { FastifyRequest, FastifyReply } from 'fastify';

export const checkHealth = async (req, reply) => {
  reply.send({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
};