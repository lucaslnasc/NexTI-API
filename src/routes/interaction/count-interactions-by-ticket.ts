import { FastifyReply, FastifyRequest } from 'fastify';
import { countInteractionsByTicketIdController } from '../../controllers/interaction.controller';

/**
 * Handler para contar interações de um ticket
 * GET /interactions/ticket/:ticketId/count
 */
export async function countInteractionsByTicketIdHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return countInteractionsByTicketIdController(request, reply);
}
