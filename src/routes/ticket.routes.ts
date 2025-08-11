import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  createTicketSchema,
  ticketFiltersSchema,
  updateTicketStatusSchema
} from '../schemas/ticket.schema';
import { TicketService } from '../services/ticket.service';

const ticketService = new TicketService();

/**
 * Rotas para gerenciamento de tickets
 */
export async function ticketRoutes(fastify: FastifyInstance) {

  /**
   * POST /api/tickets
   * Cria um novo ticket
   */
  fastify.post('/api/tickets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Valida os dados de entrada com Zod
      const validatedData = createTicketSchema.parse(request.body);

      // Cria o ticket usando o service
      const ticket = await ticketService.createTicket(validatedData);

      return reply.status(201).send({
        success: true,
        message: 'Ticket criado com sucesso',
        data: ticket,
      });
    } catch (error: any) {
      console.error('Erro na rota POST /api/tickets:', error);

      // Erro de validação do Zod
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  });

  /**
   * GET /api/tickets
   * Lista todos os tickets com filtros opcionais
   */
  fastify.get('/api/tickets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Valida e processa os query parameters
      const filters = ticketFiltersSchema.parse(request.query);

      // Busca os tickets usando o service
      const result = await ticketService.getTickets(filters);

      return reply.send({
        success: true,
        message: 'Tickets encontrados',
        data: result.tickets,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Erro na rota GET /api/tickets:', error);

      // Erro de validação do Zod
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.errors,
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  });

  /**
   * GET /api/tickets/:id
   * Busca um ticket específico por ID
   */
  fastify.get('/api/tickets/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Busca o ticket usando o service
      const ticket = await ticketService.getTicketById(id);

      return reply.send({
        success: true,
        message: 'Ticket encontrado',
        data: ticket,
      });
    } catch (error: any) {
      console.error('Erro na rota GET /api/tickets/:id:', error);

      if (error.message === 'Ticket não encontrado') {
        return reply.status(404).send({
          success: false,
          message: 'Ticket não encontrado',
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  });

  /**
   * PATCH /api/tickets/:id/status
   * Atualiza o status de um ticket
   */
  fastify.patch('/api/tickets/:id/status', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Valida os dados de entrada com Zod
      const validatedData = updateTicketStatusSchema.parse(request.body);

      // Atualiza o ticket usando o service
      const ticket = await ticketService.updateTicketStatus(id, validatedData);

      return reply.send({
        success: true,
        message: 'Status do ticket atualizado com sucesso',
        data: ticket,
      });
    } catch (error: any) {
      console.error('Erro na rota PATCH /api/tickets/:id/status:', error);

      // Erro de validação do Zod
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  });
}
