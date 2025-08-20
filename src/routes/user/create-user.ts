import { createUserController } from '../../controllers/user.controller';

/**
 * Handler para criar usuário
 * POST /users
 */
export const createUserHandler = {
  schema: {
    description: 'Cria um novo usuário',
    tags: ['users'],
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', description: 'Nome do usuário' },
        email: { type: 'string', format: 'email', description: 'Email do usuário' },
        phone: { type: 'string', description: 'Telefone do usuário' },
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  handler: createUserController,
};
