import { FastifyInstance } from 'fastify';
// Rota para listar usuários
import { UserController } from '../../controllers/user.controller';
const userController = new UserController();

export async function getUsers(app: FastifyInstance) {
  app.get('/api/users', userController.getUsers.bind(userController));
}
