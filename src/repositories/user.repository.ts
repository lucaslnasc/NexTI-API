// Repositório responsável por acessar o banco de dados para entidades de usuário
// Aqui ficam apenas as operações diretas com o Prisma
import { prisma } from '@/lib/prisma'
import { CreateUserType, UpdateUserType } from '../schemas/user.schema'

export class UserRepository {
  // Cria um novo usuário
  async create(data: CreateUserType) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
  }

  // Busca todos os usuários
  async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tickets: true } },
      },
    })
  }

  // Busca usuário por ID
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        tickets: { orderBy: { createdAt: 'desc' } },
      },
    })
  }

  // Atualiza usuário
  async update(id: string, data: UpdateUserType) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    })
  }

  // Deleta usuário
  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }
}
