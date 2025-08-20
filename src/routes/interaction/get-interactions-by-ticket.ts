import { FastifyReply, FastifyRequest } from 'fastify';
import { getInteractionsByTicketIdController } from '../../controllers/interaction.controller';

/**
 * Handler para buscar interações de um ticket
 * GET /interactions/ticket/:ticketId
 */
export async function getInteractionsByTicketIdHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return getInteractionsByTicketIdController(request, reply);
}
