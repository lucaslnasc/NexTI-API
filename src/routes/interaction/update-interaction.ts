import { FastifyReply, FastifyRequest } from 'fastify';
import { updateInteractionController } from '../../controllers/interaction.controller';

/**
 * Handler para atualizar interação
 * PUT /interactions/:id
 */
export async function updateInteractionHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  return updateInteractionController(request, reply);
}
