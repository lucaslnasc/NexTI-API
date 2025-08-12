
import { prisma } from '@/lib/prisma';

/**
 * Cliente global do Prisma para conexão com o banco de dados
 * Instância importada de lib/prisma.ts
 */

/**
 * Função para conectar ao banco de dados
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('📦 Conectado ao banco de dados PostgreSQL');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

/**
 * Função para desconectar do banco de dados
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('📦 Desconectado do banco de dados PostgreSQL');
  } catch (error) {
    console.error('❌ Erro ao desconectar do banco de dados:', error);
  }
}
