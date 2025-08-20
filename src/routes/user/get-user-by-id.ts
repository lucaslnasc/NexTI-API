import { getUserByIdController } from '../../controllers/user.controller';

/**
 * Handler para buscar usuário por ID
 * GET /users/:id
 */
export const getUserByIdHandler = {
  schema: {
    description: 'Busca um usuário pelo ID',
    tags: ['users'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID do usuário' },
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
  handler: getUserByIdController,
};
