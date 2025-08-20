import { FastifyReply, FastifyRequest } from 'fastify';
import { getInteractionByIdController } from '../../controllers/interaction.controller';

/**
 * Handler para buscar interação por ID
 * GET /interactions/:id
 */
export async function getInteractionByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  return getInteractionByIdController(request, reply);
}
