import { FastifyInstance } from 'fastify';
import { checkHealth } from '../controllers/health.controller';

export default async function (fastify) {
  fastify.get('/', checkHealth);
}