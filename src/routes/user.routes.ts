import { FastifyInstance } from 'fastify';
import { createUserHandler } from './user/create-user';
import { deleteUserHandler } from './user/delete-user';
import { getUserByIdHandler } from './user/get-user-by-id';
import { getUsersHandler } from './user/get-users';
import { updateUserHandler } from './user/update-user';

/**
 * Plugin de rotas para Users
 * Define todas as rotas HTTP relacionadas aos usuários
 */
export async function userRoutes(fastify: FastifyInstance) {
  // Criar usuário
  fastify.post('/users', createUserHandler);

  // Listar usuários
  fastify.get('/users', getUsersHandler);

  // Buscar usuário por ID
  fastify.get('/users/:id', getUserByIdHandler);

  // Atualizar usuário
  fastify.put('/users/:id', updateUserHandler);

  // Deletar usuário
  fastify.delete('/users/:id', deleteUserHandler);
}
