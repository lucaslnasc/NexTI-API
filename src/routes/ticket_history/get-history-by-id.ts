import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistoryByIdController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar entrada do histórico por ID
 * GET /ticket-history/:id
 */
export async function getHistoryByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  return getHistoryByIdController(request, reply);
}
