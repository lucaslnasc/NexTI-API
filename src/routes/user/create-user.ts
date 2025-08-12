import { FastifyInstance } from 'fastify';
// Rota para criar usuário
// Aqui só registramos a rota e delegamos para o controller
import { UserController } from '../../controllers/user.controller';
const userController = new UserController();

export async function createUser(app: FastifyInstance) {
  app.post('/api/users', userController.createUser.bind(userController));
}
