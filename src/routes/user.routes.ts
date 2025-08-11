import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  createUserSchema,
  updateUserSchema
} from '../schemas/user.schema';
import { UserService } from '../services/user.service';

const userService = new UserService();

/**
 * Rotas para gerenciamento de usuários
 */
export async function userRoutes(fastify: FastifyInstance) {

  /**
   * POST /api/users
   * Cria um novo usuário
   */
  fastify.post('/api/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Valida os dados de entrada com Zod
      const validatedData = createUserSchema.parse(request.body);

      // Cria o usuário usando o service
      const user = await userService.createUser(validatedData);

      return reply.status(201).send({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error: any) {
      console.error('Error in POST /api/users:', error);

      // Erro de validação do Zod
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          message: 'Invalid data',
          errors: error.errors,
        });
      }

      // Email já existe
      if (error.message === 'Email already exists') {
        return reply.status(409).send({
          success: false,
          message: 'Email already exists',
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  });

  /**
   * GET /api/users
   * Lista todos os usuários
   */
  fastify.get('/api/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Busca os usuários usando o service
      const users = await userService.getUsers();

      return reply.send({
        success: true,
        message: 'Users found',
        data: users,
      });
    } catch (error: any) {
      console.error('Error in GET /api/users:', error);

      return reply.status(500).send({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  });

  /**
   * GET /api/users/:id
   * Busca um usuário específico por ID
   */
  fastify.get('/api/users/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Busca o usuário usando o service
      const user = await userService.getUserById(id);

      return reply.send({
        success: true,
        message: 'User found',
        data: user,
      });
    } catch (error: any) {
      console.error('Error in GET /api/users/:id:', error);

      if (error.message === 'User not found') {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  });

  /**
   * PATCH /api/users/:id
   * Atualiza um usuário
   */
  fastify.patch('/api/users/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Valida os dados de entrada com Zod
      const validatedData = updateUserSchema.parse(request.body);

      // Atualiza o usuário usando o service
      const user = await userService.updateUser(id, validatedData);

      return reply.send({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error: any) {
      console.error('Error in PATCH /api/users/:id:', error);

      // Erro de validação do Zod
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          message: 'Invalid data',
          errors: error.errors,
        });
      }

      // Email já existe
      if (error.message === 'Email already exists') {
        return reply.status(409).send({
          success: false,
          message: 'Email already exists',
        });
      }

      // Usuário não encontrado
      if (error.message === 'User not found') {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  });

  /**
   * DELETE /api/users/:id
   * Deleta um usuário
   */
  fastify.delete('/api/users/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // Deleta o usuário usando o service
      const result = await userService.deleteUser(id);

      return reply.send({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('Error in DELETE /api/users/:id:', error);

      if (error.message === 'User not found') {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  });
}
