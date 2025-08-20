import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistoryByChangedByController } from '../../controllers/ticket_history.controller';

/**
 * Handler para buscar histórico por usuário
 * GET /ticket-history/user/:userId
 */
export async function getHistoryByUserHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  return getHistoryByChangedByController(request, reply);
}
