// Usecase: regras de negócio para usuário
// Aqui ficam as validações e orquestrações de operações
import { UserRepository } from '../repositories/user.repository'
import { CreateUserType, UpdateUserType } from '../schemas/user.schema'

export class UserUseCase {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  // Cria usuário com validação de email duplicado
  async createUser(data: CreateUserType) {
    try {
      return await this.userRepository.create(data)
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists')
      }
      throw new Error('Internal server error while creating user')
    }
  }

  // Lista todos os usuários
  async getUsers() {
    try {
      return await this.userRepository.findAll()
    } catch {
      throw new Error('Internal server error while fetching users')
    }
  }

  // Busca usuário por ID
  async getUserById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }

  // Atualiza usuário
  async updateUser(id: string, data: UpdateUserType) {
    try {
      return await this.userRepository.update(id, data)
    } catch (error: any) {
      if (error.code === 'P2002') throw new Error('Email already exists')
      if (error.code === 'P2025') throw new Error('User not found')
      throw new Error('Internal server error while updating user')
    }
  }

  // Deleta usuário
  async deleteUser(id: string) {
    try {
      await this.userRepository.delete(id)
      return { message: 'User deleted successfully' }
    } catch (error: any) {
      if (error.code === 'P2025') throw new Error('User not found')
      throw new Error('Internal server error while deleting user')
    }
  }
}
