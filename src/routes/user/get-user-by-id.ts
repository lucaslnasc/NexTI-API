import { FastifyInstance } from 'fastify';
// Rota para buscar usuário por ID
import { UserController } from '../../controllers/user.controller';
const userController = new UserController();

export async function getUserById(app: FastifyInstance) {
  app.get('/api/users/:id', userController.getUserById.bind(userController));
}
