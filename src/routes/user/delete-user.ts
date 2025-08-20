import { deleteUserController } from '../../controllers/user.controller';

/**
 * Handler para deletar usuário
 * DELETE /users/:id
 */
export const deleteUserHandler = {
  schema: {
    description: 'Deleta um usuário',
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
        },
      },
    },
  },
  handler: deleteUserController,
};
