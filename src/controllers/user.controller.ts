// Controller: recebe requisições HTTP e chama os usecases
// Aqui ficam apenas as chamadas e tratamento de resposta/erro
import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserSchema, updateUserSchema } from '../schemas/user.schema'
import { UserUseCase } from '../usecases/user.usecase'

const userUseCase = new UserUseCase()

export class UserController {
  // Cria usuário
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validação com Zod
      const validatedData = createUserSchema.parse(request.body)
      const user = await userUseCase.createUser(validatedData)
      return reply.status(201).send({ success: true, message: 'User created successfully', data: user })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, message: 'Invalid data', errors: error.errors })
      }
      if (error.message === 'Email already exists') {
        return reply.status(409).send({ success: false, message: 'Email already exists' })
      }
      return reply.status(500).send({ success: false, message: error.message || 'Internal server error' })
    }
  }

  // Lista usuários
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userUseCase.getUsers()
      return reply.send({ success: true, message: 'Users found', data: users })
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message || 'Internal server error' })
    }
  }

  // Busca usuário por ID
  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const user = await userUseCase.getUserById(id)
      return reply.send({ success: true, message: 'User found', data: user })
    } catch (error: any) {
      if (error.message === 'User not found') {
        return reply.status(404).send({ success: false, message: 'User not found' })
      }
      return reply.status(500).send({ success: false, message: error.message || 'Internal server error' })
    }
  }

  // Atualiza usuário
  async updateUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const validatedData = updateUserSchema.parse(request.body)
      const user = await userUseCase.updateUser(id, validatedData)
      return reply.send({ success: true, message: 'User updated successfully', data: user })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, message: 'Invalid data', errors: error.errors })
      }
      if (error.message === 'Email already exists') {
        return reply.status(409).send({ success: false, message: 'Email already exists' })
      }
      if (error.message === 'User not found') {
        return reply.status(404).send({ success: false, message: 'User not found' })
      }
      return reply.status(500).send({ success: false, message: error.message || 'Internal server error' })
    }
  }

  // Deleta usuário
  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const result = await userUseCase.deleteUser(id)
      return reply.send({ success: true, message: result.message })
    } catch (error: any) {
      if (error.message === 'User not found') {
        return reply.status(404).send({ success: false, message: 'User not found' })
      }
      return reply.status(500).send({ success: false, message: error.message || 'Internal server error' })
    }
  }
}
