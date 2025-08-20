import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistoryByStatusController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar histórico por status
 * GET /ticket-history/status/:status
 */
export async function getHistoryByStatusHandler(
  request: FastifyRequest<{ Params: { status: string } }>,
  reply: FastifyReply
) {
  return getHistoryByStatusController(request, reply);
}
