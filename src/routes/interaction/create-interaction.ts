import { FastifyReply, FastifyRequest } from 'fastify';
import { createInteractionController } from '../../controllers/interaction.controller';

/**
 * Handler para criar nova interação
 * POST /interactions
 */
export async function createInteractionHandler(request: FastifyRequest, reply: FastifyReply) {
  return createInteractionController(request, reply);
}
