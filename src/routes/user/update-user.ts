import { updateUserController } from '../../controllers/user.controller';

/**
 * Handler para atualizar usuário
 * PUT /users/:id
 */
export const updateUserHandler = {
  schema: {
    description: 'Atualiza um usuário existente',
    tags: ['users'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID do usuário' },
      },
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nome do usuário' },
        email: { type: 'string', format: 'email', description: 'Email do usuário' },
        phone: { type: 'string', description: 'Telefone do usuário' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  handler: updateUserController,
};
