import { FastifyInstance } from 'fastify';
// Rota para deletar usuário
import { UserController } from '../../controllers/user.controller';
const userController = new UserController();

export async function deleteUser(app: FastifyInstance) {
  app.delete('/api/users/:id', userController.deleteUser.bind(userController));
}
