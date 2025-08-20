import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistoryByTicketIdController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar histórico de um ticket
 * GET /ticket-history/ticket/:ticketId
 */
export async function getHistoryByTicketIdHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return getHistoryByTicketIdController(request, reply);
}
