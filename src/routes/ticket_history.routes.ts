import { FastifyInstance } from 'fastify';
import { countHistoryByTicketIdHandler } from './ticket_history/count-history-by-ticket';
import { generateTicketActivityReportHandler } from './ticket_history/generate-ticket-activity-report';
import { getHistoryByDateRangeHandler } from './ticket_history/get-history-by-date-range';
import { getHistoryByIdHandler } from './ticket_history/get-history-by-id';
import { getHistoryByStatusHandler } from './ticket_history/get-history-by-status';
import { getHistoryByTicketIdHandler } from './ticket_history/get-history-by-ticket';
import { getHistoryByUserHandler } from './ticket_history/get-history-by-user';
import { getLatestHistoryByTicketIdHandler } from './ticket_history/get-latest-history-by-ticket';
import { recordChangeHandler } from './ticket_history/record-change';

/**
 * Plugin de rotas para Ticket History
 * Define todas as rotas HTTP relacionadas ao histórico de mudanças nos tickets
 */
export async function ticketHistoryRoutes(fastify: FastifyInstance) {
  // Registrar mudança no histórico
  fastify.post('/ticket-history', recordChangeHandler);

  // Buscar entrada específica do histórico
  fastify.get('/ticket-history/:id', getHistoryByIdHandler);

  // Buscar histórico de um ticket
  fastify.get('/ticket-history/ticket/:ticketId', getHistoryByTicketIdHandler);

  // Contar entradas do histórico
  fastify.get('/ticket-history/ticket/:ticketId/count', countHistoryByTicketIdHandler);

  // Buscar última entrada do histórico
  fastify.get('/ticket-history/ticket/:ticketId/latest', getLatestHistoryByTicketIdHandler);

  // Gerar relatório de atividade
  fastify.get('/ticket-history/ticket/:ticketId/report', generateTicketActivityReportHandler);

  // Buscar histórico por usuário
  fastify.get('/ticket-history/user/:userId', getHistoryByUserHandler);

  // Buscar histórico por status
  fastify.get('/ticket-history/status/:status', getHistoryByStatusHandler);

  // Buscar histórico por período
  fastify.get('/ticket-history/date-range', getHistoryByDateRangeHandler);
}
