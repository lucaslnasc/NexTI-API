import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createTicketSchema,
  ticketFiltersSchema,
  updateTicketStatusSchema
} from '../schemas/ticket.schema';
import { TicketUsecase } from '../usecases/ticket.usecase';

// Instancia o usecase responsável pelas regras de negócio do ticket
const ticketUsecase = new TicketUsecase();

/**
 * Controller para criação de ticket
 * - Valida os dados recebidos
 * - Chama o usecase para criar o ticket
 * - Retorna resposta adequada
 */
export async function createTicketController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validação dos dados de entrada
    const validatedData = createTicketSchema.parse(request.body);
    // Criação do ticket via usecase
    const ticket = await ticketUsecase.createTicket(validatedData);
    // Resposta de sucesso
    return reply.status(201).send({
      success: true,
      message: 'Ticket criado com sucesso',
      data: ticket,
    });
  } catch (error: any) {
    // Erro de validação
    if (error.name === 'ZodError') {
      return reply.status(400).send({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }
    // Erro interno
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para listagem de tickets
 * - Valida filtros recebidos
 * - Chama o usecase para buscar tickets
 * - Retorna resposta adequada
 */
export async function listTicketsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validação dos filtros
    const filters = ticketFiltersSchema.parse(request.query);
    // Busca dos tickets via usecase
    const tickets = await ticketUsecase.getTickets(filters);
    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Tickets encontrados',
      data: tickets,
    });
  } catch (error: any) {
    // Erro de validação
    if (error.name === 'ZodError') {
      return reply.status(400).send({
        success: false,
        message: 'Parâmetros inválidos',
        errors: error.errors,
      });
    }
    // Erro interno
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar ticket por ID
 * - Chama o usecase para buscar ticket
 * - Retorna resposta adequada
 */
export async function getTicketByIdController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    // Busca ticket pelo ID via usecase
    const { id } = request.params;
    const ticket = await ticketUsecase.getTicketById(id);
    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Ticket encontrado',
      data: ticket,
    });
  } catch (error: any) {
    // Ticket não encontrado
    if (error.message === 'Ticket não encontrado') {
      return reply.status(404).send({
        success: false,
        message: 'Ticket não encontrado',
      });
    }
    // Erro interno
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para atualizar status do ticket
 * - Valida os dados recebidos
 * - Chama o usecase para atualizar status
 * - Retorna resposta adequada
 */
export async function updateTicketStatusController(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    // Validação dos dados de entrada
    const { id } = request.params;
    const validatedData = updateTicketStatusSchema.parse(request.body);
    // Atualiza status via usecase
    const ticket = await ticketUsecase.updateTicketStatus(id, validatedData);
    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Status do ticket atualizado com sucesso',
      data: ticket,
    });
  } catch (error: any) {
    // Erro de validação
    if (error.name === 'ZodError') {
      return reply.status(400).send({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }
    // Erro interno
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}
