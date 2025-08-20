import { getUsersController } from '../../controllers/user.controller';

/**
 * Handler para listar usuários
 * GET /users
 */
export const getUsersHandler = {
  schema: {
    description: 'Lista todos os usuários',
    tags: ['users'],
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  handler: getUsersController,
};
