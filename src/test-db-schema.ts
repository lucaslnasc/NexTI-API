import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Verifica se as tabelas existem
    const result = await prisma.$queryRawUnsafe<[{ tablename: string }]>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'tickets');`
    );

    const tables = result.map(r => r.tablename);
    const expected = ['users', 'tickets'];
    const missing = expected.filter(t => !tables.includes(t));

    if (missing.length === 0) {
      console.log('✅ Todas as tabelas foram criadas:', tables);
    } else {
      console.log('⚠️ Tabelas faltando:', missing);
    }
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
