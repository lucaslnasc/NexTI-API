import { FastifyReply, FastifyRequest } from 'fastify';
import { getLatestHistoryByTicketIdController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar última entrada do histórico
 * GET /ticket-history/ticket/:ticketId/latest
 */
export async function getLatestHistoryByTicketIdHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return getLatestHistoryByTicketIdController(request, reply);
}
