import { UserRepository } from '../repositories/user.repository';
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';

/**
 * UseCase responsável pelas regras de negócio relacionadas aos Users
 * Esta camada contém a lógica de negócio e orquestra as operações
 * entre diferentes repositories quando necessário
 */
export class UserUseCase {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Cria um novo usuário com validações de negócio
   * @param data - Dados do usuário a ser criado
   * @returns Promise com o usuário criado
   */
  async createUser(data: CreateUserType) {
    try {
      // Validações de negócio específicas podem ser adicionadas aqui
      if (!data.name || !data.email) {
        throw new Error('Nome e email são obrigatórios');
      }

      // Validação de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Formato de email inválido');
      }

      return await this.repository.create(data);
    } catch (error: any) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Lista todos os usuários
   * @returns Promise com array de usuários
   */
  async getUsers() {
    try {
      return await this.repository.findAll();
    } catch (error: any) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   * @param id - ID do usuário
   * @returns Promise com o usuário encontrado
   */
  async getUserById(id: string) {
    try {
      if (!id) {
        throw new Error('ID do usuário é obrigatório');
      }

      return await this.repository.findById(id);
    } catch (error: any) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Atualiza usuário existente
   * @param id - ID do usuário
   * @param data - Dados a serem atualizados
   * @returns Promise com o usuário atualizado
   */
  async updateUser(id: string, data: UpdateUserType) {
    try {
      if (!id) {
        throw new Error('ID do usuário é obrigatório');
      }

      // Validação de email se fornecido
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Formato de email inválido');
        }
      }

      return await this.repository.update(id, data);
    } catch (error: any) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Deleta usuário
   * @param id - ID do usuário a ser deletado
   * @returns Promise<void>
   */
  async deleteUser(id: string) {
    try {
      if (!id) {
        throw new Error('ID do usuário é obrigatório');
      }

      await this.repository.delete(id);
    } catch (error: any) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}
