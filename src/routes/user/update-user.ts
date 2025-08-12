import { FastifyInstance } from 'fastify';
// Rota para atualizar usuário
import { UserController } from '../../controllers/user.controller';
const userController = new UserController();

export async function updateUser(app: FastifyInstance) {
  app.patch('/api/users/:id', userController.updateUser.bind(userController));
}
