import { FastifyReply, FastifyRequest } from 'fastify';
import { deleteInteractionController } from '../../controllers/interaction.controller';

/**
 * Handler para deletar interação
 * DELETE /interactions/:id
 */
export async function deleteInteractionHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  return deleteInteractionController(request, reply);
}
