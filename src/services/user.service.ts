import { CreateUserType, UpdateUserType } from '../schemas/user.schema';
import { prisma } from './database.service';

/**
 * Service para gerenciar usuários
 */
export class UserService {
  /**
   * Cria um novo usuário no banco de dados
   */
  async createUser(data: CreateUserType) {
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      });

      return user;
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw new Error('Internal server error while creating user');
    }
  }

  /**
   * Busca todos os usuários
   */
  async getUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Internal server error while fetching users');
    }
  }

  /**
   * Busca um usuário específico por ID
   */
  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          tickets: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(id: string, data: UpdateUserType) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
        },
      });

      return user;
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw new Error('Internal server error while updating user');
    }
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return { message: 'User deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw new Error('Internal server error while deleting user');
    }
  }
}
