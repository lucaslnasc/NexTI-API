import { FastifyInstance } from 'fastify';
import { countInteractionsByTicketIdHandler } from './interaction/count-interactions-by-ticket';
import { createInteractionHandler } from './interaction/create-interaction';
import { deleteInteractionHandler } from './interaction/delete-interaction';
import { getInteractionByIdHandler } from './interaction/get-interaction-by-id';
import { getInteractionsByTicketIdHandler } from './interaction/get-interactions-by-ticket';
import { getInteractionsByUserIdHandler } from './interaction/get-interactions-by-user';
import { updateInteractionHandler } from './interaction/update-interaction';

/**
 * Plugin de rotas para Interactions
 * Define todas as rotas HTTP relacionadas às interações (mensagens dos tickets)
 */
export async function interactionRoutes(fastify: FastifyInstance) {
  // Criar nova interação
  fastify.post('/interactions', createInteractionHandler);

  // Buscar interação por ID
  fastify.get('/interactions/:id', getInteractionByIdHandler);

  // Atualizar interação
  fastify.put('/interactions/:id', updateInteractionHandler);

  // Deletar interação
  fastify.delete('/interactions/:id', deleteInteractionHandler);

  // Buscar interações de um ticket
  fastify.get('/interactions/ticket/:ticketId', getInteractionsByTicketIdHandler);

  // Contar interações de um ticket
  fastify.get('/interactions/ticket/:ticketId/count', countInteractionsByTicketIdHandler);

  // Buscar interações de um usuário
  fastify.get('/interactions/user/:userId', getInteractionsByUserIdHandler);
}
