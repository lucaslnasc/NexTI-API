import { FastifyReply, FastifyRequest } from 'fastify';
import { generateTicketActivityReportController } from '../../controllers/ticket_history.controller';

/**
 * Handler para gerar relatório de atividade
 * GET /ticket-history/ticket/:ticketId/report
 */
export async function generateTicketActivityReportHandler(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  return generateTicketActivityReportController(request, reply);
}
