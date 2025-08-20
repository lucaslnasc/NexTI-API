import { FastifyReply, FastifyRequest } from 'fastify';
import { countHistoryByTicketIdController } from '../../controllers/ticket_history.controller';

/**
 * Handler para contar entradas do histórico
 * GET /ticket-history/ticket/:ticketId/count
 */
export async function countHistoryByTicketIdHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return countHistoryByTicketIdController(request, reply);
}
