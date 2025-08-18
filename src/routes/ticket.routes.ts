
import { FastifyInstance } from 'fastify';
import { createTicketHandler } from './ticket/create-ticket';
import { getTicketByIdHandler } from './ticket/get-ticket-by-id';
import { listTicketsHandler } from './ticket/list-tickets';
import { updateTicketStatusHandler } from './ticket/update-ticket-status';

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.post('/api/tickets', createTicketHandler);
  fastify.get('/api/tickets', listTicketsHandler);
  fastify.get('/api/tickets/:id', getTicketByIdHandler);
  fastify.patch('/api/tickets/:id/status', updateTicketStatusHandler);
}
