import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistoryByDateRangeController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar histórico por período
 * GET /ticket-history/date-range
 */
export async function getHistoryByDateRangeHandler(
  request: FastifyRequest<{ Querystring: { startDate: string; endDate: string } }>,
  reply: FastifyReply
) {
  return getHistoryByDateRangeController(request, reply);
}
