import { FastifyReply, FastifyRequest } from 'fastify';
import { interactionSchema } from '../schemas/interaction.schema';
import { InteractionUseCase } from '../usecases/interaction.usecase';

/**
 * Controller responsável por gerenciar requisições HTTP relacionadas às Interactions
 * Esta camada recebe as requisições, valida dados, chama os UseCases e retorna respostas
 */

// Instancia o usecase responsável pelas regras de negócio das interações
const interactionUseCase = new InteractionUseCase();

/**
 * Controller para criação de interação (mensagem em ticket)
 * POST /interactions
 * @param request - Requisição HTTP com dados da interação
 * @param reply - Resposta HTTP
 */
export async function createInteractionController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validação dos dados de entrada usando Zod schema
    const validatedData = interactionSchema.omit({ id: true }).parse(request.body);

    // Criação da interação via usecase
    const interaction = await interactionUseCase.createInteraction(validatedData);

    // Resposta de sucesso
    return reply.status(201).send({
      success: true,
      message: 'Interação criada com sucesso',
      data: interaction,
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
 * Controller para buscar interações de um ticket específico
 * GET /interactions/ticket/:ticketId
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getInteractionsByTicketIdController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Busca interações via usecase
    const interactions = await interactionUseCase.getInteractionsByTicketId(ticketId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${interactions.length} interações encontradas`,
      data: interactions,
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
 * Controller para buscar uma interação específica pelo ID
 * GET /interactions/:id
 * @param request - Requisição HTTP com ID da interação nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getInteractionByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Busca interação via usecase
    const interaction = await interactionUseCase.getInteractionById(id);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Interação encontrada',
      data: interaction,
    });
  } catch (error: any) {
    // Erro de não encontrado
    if (error.message.includes('não encontrada')) {
      return reply.status(404).send({
        success: false,
        message: 'Interação não encontrada',
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
 * Controller para buscar interações de um usuário específico
 * GET /interactions/user/:userId
 * @param request - Requisição HTTP com ID do usuário nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getInteractionsByUserIdController(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;

    // Busca interações via usecase
    const interactions = await interactionUseCase.getInteractionsByUserId(userId);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${interactions.length} interações encontradas para o usuário`,
      data: interactions,
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
 * Controller para atualizar uma interação existente
 * PUT /interactions/:id
 * @param request - Requisição HTTP com ID nos parâmetros e dados no body
 * @param reply - Resposta HTTP
 */
export async function updateInteractionController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Validação dos dados de atualização (campos opcionais)
    const validatedData = interactionSchema.omit({ id: true }).partial().parse(request.body);

    // Atualização via usecase
    const updatedInteraction = await interactionUseCase.updateInteraction(id, validatedData);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Interação atualizada com sucesso',
      data: updatedInteraction,
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

    // Erro de não encontrado
    if (error.message.includes('não encontrada')) {
      return reply.status(404).send({
        success: false,
        message: 'Interação não encontrada',
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
 * Controller para deletar uma interação
 * DELETE /interactions/:id
 * @param request - Requisição HTTP com ID nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function deleteInteractionController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Deleção via usecase
    await interactionUseCase.deleteInteraction(id);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Interação deletada com sucesso',
    });
  } catch (error: any) {
    // Erro de não encontrado
    if (error.message.includes('não encontrada')) {
      return reply.status(404).send({
        success: false,
        message: 'Interação não encontrada',
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
 * Controller para contar interações de um ticket
 * GET /interactions/ticket/:ticketId/count
 * @param request - Requisição HTTP com ID do ticket nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function countInteractionsByTicketIdController(
  request: FastifyRequest<{ Params: { ticketId: string } }>,
  reply: FastifyReply
) {
  try {
    const { ticketId } = request.params;

    // Contagem via usecase
    const count = await interactionUseCase.countInteractionsByTicketId(ticketId);

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
