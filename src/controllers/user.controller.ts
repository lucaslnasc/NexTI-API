import { FastifyReply, FastifyRequest } from 'fastify';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { UserUseCase } from '../usecases/user.usecase';

/**
 * Controller responsável por gerenciar requisições HTTP relacionadas aos Users
 * Esta camada recebe as requisições, valida dados, chama os UseCases e retorna respostas
 */

// Instancia o usecase responsável pelas regras de negócio dos usuários
const userUseCase = new UserUseCase();

/**
 * Controller para criação de usuário
 * POST /users
 * @param request - Requisição HTTP com dados do usuário
 * @param reply - Resposta HTTP
 */
export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validação dos dados de entrada usando Zod schema
    const validatedData = createUserSchema.parse(request.body);

    // Criação do usuário via usecase
    const user = await userUseCase.createUser(validatedData);

    // Resposta de sucesso
    return reply.status(201).send({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user,
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

    // Erro de email já existe
    if (error.message === 'Email already exists') {
      return reply.status(409).send({
        success: false,
        message: 'Email já existe',
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
 * Controller para listagem de usuários
 * GET /users
 * @param request - Requisição HTTP
 * @param reply - Resposta HTTP
 */
export async function getUsersController(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log('📋 Buscando usuários...');
    
    // Busca usuários via usecase
    const users = await userUseCase.getUsers();
    
    console.log('✅ Usuários encontrados:', users?.length || 0);
    console.log('📄 Dados dos usuários:', JSON.stringify(users, null, 2));

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: `${users?.length || 0} usuários encontrados`,
      data: users || [],
    });
  } catch (error: any) {
    console.error('❌ Erro ao buscar usuários:', error);
    
    // Tratamento de erro
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}

/**
 * Controller para buscar usuário por ID
 * GET /users/:id
 * @param request - Requisição HTTP com ID do usuário nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function getUserByIdController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    console.log('🔍 Buscando usuário por ID:', id);

    // Busca usuário via usecase
    const user = await userUseCase.getUserById(id);
    
    console.log('✅ Usuário encontrado:', JSON.stringify(user, null, 2));

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Usuário encontrado',
      data: user,
    });
  } catch (error: any) {
    console.error('❌ Erro ao buscar usuário por ID:', error);
    
    // Erro de não encontrado
    if (error.message === 'User not found') {
      return reply.status(404).send({
        success: false,
        message: 'Usuário não encontrado',
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
 * Controller para atualizar usuário
 * PUT /users/:id
 * @param request - Requisição HTTP com ID nos parâmetros e dados no body
 * @param reply - Resposta HTTP
 */
export async function updateUserController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Validação dos dados de atualização
    const validatedData = updateUserSchema.parse(request.body);

    // Atualização via usecase
    const user = await userUseCase.updateUser(id, validatedData);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user,
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

    // Erro de email já existe
    if (error.message === 'Email already exists') {
      return reply.status(409).send({
        success: false,
        message: 'Email já existe',
      });
    }

    // Erro de não encontrado
    if (error.message === 'User not found') {
      return reply.status(404).send({
        success: false,
        message: 'Usuário não encontrado',
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
 * Controller para deletar usuário
 * DELETE /users/:id
 * @param request - Requisição HTTP com ID nos parâmetros
 * @param reply - Resposta HTTP
 */
export async function deleteUserController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    // Deleção via usecase
    await userUseCase.deleteUser(id);

    // Resposta de sucesso
    return reply.send({
      success: true,
      message: 'Usuário deletado com sucesso',
    });
  } catch (error: any) {
    // Erro de não encontrado
    if (error.message === 'User not found') {
      return reply.status(404).send({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Erro interno
    return reply.status(500).send({
      success: false,
      message: error.message || 'Erro interno do servidor',
    });
  }
}
