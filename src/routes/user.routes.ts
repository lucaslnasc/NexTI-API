import { FastifyInstance } from 'fastify';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController
} from '../controllers/user.controller';

/**
 * Plugin de rotas para Users
 * Define todas as rotas HTTP relacionadas aos usuários
 */
export async function userRoutes(fastify: FastifyInstance) {
  // Criar usuário
  fastify.post('/users', createUserController);

  // Listar usuários
  fastify.get('/users', getUsersController);

  // Buscar usuário por ID
  fastify.get('/users/:id', getUserByIdController);

  // Atualizar usuário
  fastify.put('/users/:id', updateUserController);

  // Deletar usuário
  fastify.delete('/users/:id', deleteUserController);
}
