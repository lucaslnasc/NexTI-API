import { FastifyReply, FastifyRequest } from 'fastify';
import { recordChangeController } from '../../controllers/ticket_history.controller';

/**
 * Handler para registrar mudança no histórico
 * POST /ticket-history
 */
export async function recordChangeHandler(request: FastifyRequest, reply: FastifyReply) {
  return recordChangeController(request, reply);
}
