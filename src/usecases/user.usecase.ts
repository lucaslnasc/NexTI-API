// Usecase: regras de negócio para usuário
// Aqui ficam as validações e orquestrações de operações
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

/**
 * Usecase de usuário usando Supabase
 */
export class UserUseCase {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  /** Cria usuário com validação de email duplicado */
  async createUser(data: CreateUserType) {
    return this.service.createUser(data);
  }

  /** Lista todos os usuários */
  async getUsers() {
    return this.service.getUsers();
  }

  /** Busca usuário por ID */
  async getUserById(id: string) {
    return this.service.getUserById(id);
  }

  /** Atualiza usuário */
  async updateUser(id: string, data: UpdateUserType) {
    return this.service.updateUser(id, data);
  }

  /** Deleta usuário */
  async deleteUser(id: string) {
    return this.service.deleteUser(id);
  }
}
