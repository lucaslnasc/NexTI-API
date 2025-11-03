
import { FastifyInstance } from 'fastify';
import { createTicketHandler } from './ticket/create-ticket';
import { getTicketByIdHandler } from './ticket/get-ticket-by-id';
import { listTicketsHandler } from './ticket/list-tickets';
import { updateTicketStatusHandler } from './ticket/update-ticket-status';

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.post('/tickets', createTicketHandler);
  fastify.get('/tickets', listTicketsHandler);
  fastify.get('/tickets/:id', getTicketByIdHandler);
  fastify.patch('/tickets/:id/status', updateTicketStatusHandler);
}
