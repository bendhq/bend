import { FastifyRequest, FastifyReply } from 'fastify';

export const checkHealth = async (req: FastifyRequest, reply: FastifyReply) => {
  reply.send({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
};