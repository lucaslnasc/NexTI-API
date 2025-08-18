import { UserRepository } from '../repositories/user.repository';
import { CreateUserType, UpdateUserType } from '../schemas/user.schema';

/**
 * Service para gerenciar usuários usando Supabase
 */
export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }
  /**
   * Cria um novo usuário na tabela 'users' do Supabase
   */
  async createUser(data: CreateUserType) {
    // Regras de negócio podem ser aplicadas aqui
    // Exemplo: checar duplicidade de email (deve ser implementado no repository ou aqui)
    return this.repository.create(data);
  }

  /**
   * Busca todos os usuários da tabela 'users'
   */
  async getUsers() {
    return this.repository.findAll();
  }

  /**
   * Busca um usuário específico por ID
   */
  async getUserById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(id: string, data: UpdateUserType) {
    return this.repository.update(id, data);
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(id: string) {
    return this.repository.delete(id);
  }
}
