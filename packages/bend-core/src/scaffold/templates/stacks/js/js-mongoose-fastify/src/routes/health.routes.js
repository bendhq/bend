import { FastifyInstance } from 'fastify';
import { checkHealth } from '../controllers/health.controller.js';

export default async function (fastify) {
  fastify.get('/', checkHealth);
}