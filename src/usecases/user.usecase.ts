// Usecase: regras de negócio para usuário
// Aqui ficam as validações e orquestrações de operações
import { UserRepository } from '../repositories/user.repository';
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';

/**
 * Usecase de usuário usando Supabase
 */
export class UserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /** Cria usuário com validação de email duplicado */
  async createUser(data: CreateUserType) {
    return await this.userRepository.create(data);
  }

  /** Lista todos os usuários */
  async getUsers() {
    return await this.userRepository.findAll();
  }

  /** Busca usuário por ID */
  async getUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  /** Atualiza usuário */
  async updateUser(id: string, data: UpdateUserType) {
    return await this.userRepository.update(id, data);
  }

  /** Deleta usuário */
  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }
}
