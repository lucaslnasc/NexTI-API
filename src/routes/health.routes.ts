import { FastifyInstance } from 'fastify';

/**
 * Rota de healthcheck
 */
export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/healthcheck', async (request, reply) => {
    return reply.send({ status: 'ok' });
  });
}
