import { FastifyRequest, FastifyReply } from 'fastify';
import createError from 'http-errors';
import Joi from 'joi';

export function validateWithJoi(schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const data = (request as any)[source];
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
      reply.status(400).send({
        status: 'fail',
        message: 'Validation error',
        details: error.details.map((d) => ({ message: d.message, path: d.path }))
      });
      throw createError(400, 'Validation error');
    }
    (request as any)[source] = value;
  };
}
