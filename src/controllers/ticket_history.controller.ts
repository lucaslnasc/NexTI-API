import { FastifyReply, FastifyRequest } from 'fastify';
import { ticketHistorySchema } from '../schemas/ticket_history.schema';
import { TicketHistoryUseCase } from '../usecases/ticket_history.usecase';

/**
 * Controller responsável por gerenciar requisições HTTP relacionadas ao Ticket History
 * Esta camada recebe as requisições, valida dados, chama os UseCases e retorna respostas
 * Focado em auditoria e rastreamento de mudanças nos tickets
 */

// Instancia o usecase responsável pelas regras de negócio do histórico
const ticketHistoryUseCase = new TicketHistoryUseCase();

/**
 * Controller para registrar uma mudança no histórico do ticket
 * POST /ticket-history
 * @param request - Requisição HTTP com dados da mudança
 * @param reply - Resposta HTTP
 */
export async function recordChangeController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validação dos dados de entrada usando Zod schema
    const validatedData = ticketHistorySchema.omit({ id: true }).parse(request.body);

    // Registro da mudança via usecase
    const historyEntry = await ticketHistoryUseCase.recordChange(validatedData);

    // Resposta de sucesso
    return reply.status(201).send({
      success: true,
      message: 'Mudança registrada no histórico com sucesso',
      data: historyEntry,
    });
  } catch (error: any) {
    // Erro de validação Zod
    if (error.name === 'ZodError') {
      return reply.status(400).send({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    // Erro interno ou de negócio
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar histórico de um ticket específico
 * GET /ticket-history/ticket/:ticketId
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getHistoryByTicketIdController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Busca histórico via usecase
    const history = await ticketHistoryUseCase.getHistoryByTicketId(ticketId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${history.length} entradas encontradas no histórico`,
      data: history,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar uma entrada específica do histórico pelo ID
 * GET /ticket-history/:id
 * @param request - Requisição HTTP com ID da entrada nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getHistoryByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Busca entrada via usecase
    const historyEntry = await ticketHistoryUseCase.getHistoryById(id);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Entrada do histórico encontrada',
      data: historyEntry,
    });
  } catch (error: any) {
    // Erro de não encontrado
    if (error.message.includes('não encontrada')) {
      return reply.status(404).send({
        success: false,
        message: 'Entrada do histórico não encontrada',
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
 * Controller para buscar histórico por usuário que fez a alteração
 * GET /ticket-history/user/:userId
 * @param request - Requisição HTTP com ID do usuário nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getHistoryByChangedByController(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;

    // Busca histórico via usecase
    const history = await ticketHistoryUseCase.getHistoryByChangedBy(userId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${history.length} alterações encontradas para o usuário`,
      data: history,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar histórico por status específico
 * GET /ticket-history/status/:status
 * @param request - Requisição HTTP com status nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getHistoryByStatusController(
  request: FastifyRequest<{ Params: { status: string } }>,
  reply: FastifyReply
) {
  try {
    const { status } = request.params;

    // Busca histórico via usecase
    const history = await ticketHistoryUseCase.getHistoryByStatus(status);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${history.length} mudanças encontradas para o status '${status}'`,
      data: history,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar histórico por período de datas
 * GET /ticket-history/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @param request - Requisição HTTP com datas nos query parameters
 * @param reply - Resposta HTTP
 */
export async function getHistoryByDateRangeController(
  request: FastifyRequest<{ Querystring: { startDate: string; endDate: string } }>,
  reply: FastifyReply
) {
  try {
    const { startDate, endDate } = request.query;

    // Validação básica dos parâmetros
    if (!startDate || !endDate) {
      return reply.status(400).send({
        success: false,
        message: 'Parâmetros startDate e endDate são obrigatórios',
      });
    }

    // Busca histórico via usecase
    const history = await ticketHistoryUseCase.getHistoryByDateRange(startDate, endDate);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${history.length} entradas encontradas no período`,
      data: history,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para contar entradas no histórico de um ticket
 * GET /ticket-history/ticket/:ticketId/count
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function countHistoryByTicketIdController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Contagem via usecase
    const count = await ticketHistoryUseCase.countHistoryByTicketId(ticketId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Contagem realizada com sucesso',
      data: { count },
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar a última entrada do histórico de um ticket
 * GET /ticket-history/ticket/:ticketId/latest
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getLatestHistoryByTicketIdController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Busca última entrada via usecase
    const latestEntry = await ticketHistoryUseCase.getLatestHistoryByTicketId(ticketId);

    if (!latestEntry) {
      return reply.status(404).send({
        success: false,
        message: 'Nenhuma entrada encontrada no histórico do ticket',
      });
    }

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Última entrada do histórico encontrada',
      data: latestEntry,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para gerar relatório de atividades de um ticket
 * GET /ticket-history/ticket/:ticketId/report
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function generateTicketActivityReportController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Geração do relatório via usecase
    const report = await ticketHistoryUseCase.generateTicketActivityReport(ticketId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Relatório de atividade gerado com sucesso',
      data: report,
    });
  } catch (error: any) {
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}
