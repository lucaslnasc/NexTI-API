import { FastifyReply, FastifyRequest } from 'fastify';
import { getInteractionsByUserIdController } from '../../controllers/interaction.controller';

/**
 * Handler para buscar interações de um usuário
 * GET /interactions/user/:userId
 */
export async function getInteractionsByUserIdHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  return getInteractionsByUserIdController(request, reply);
}
