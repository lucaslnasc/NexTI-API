import cors from '@fastify/cors';
import 'dotenv/config';
import Fastify from 'fastify';
import { healthRoutes } from './routes/health.routes';
import { ticketRoutes } from './routes/ticket.routes';
import { userRoutes } from './routes/user.routes';
import { connectDatabase, disconnectDatabase } from './services/database.service';

/**
 * Configuração do servidor Fastify
 */
const server = Fastify({
  logger: process.env.NODE_ENV === 'development'
    ? {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }
    : {
      level: 'info',
    },
});

/**
 * Função para configurar o servidor
 */
async function setupServer() {
  try {
    // Registra o plugin de CORS
    await server.register(cors, {
      origin: true, // Permite todas as origens em desenvolvimento
      credentials: true,
    });

    // Conecta ao banco de dados
    await connectDatabase();

    // Registra as rotas
    await server.register(healthRoutes);
    await server.register(ticketRoutes);
    await server.register(userRoutes);

    console.log('🚀 Servidor configurado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao configurar servidor:', error);
    process.exit(1);
  }
}

/**
 * Função para iniciar o servidor
 */
async function startServer() {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`🌟 Servidor rodando em http://${host}:${port}`);
    console.log(`📋 Health check disponível em http://${host}:${port}/healthcheck`);
    console.log(`🎫 API de tickets disponível em http://${host}:${port}/api/tickets`);
    console.log(`👥 API de usuários disponível em http://${host}:${port}/api/users`);
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

/**
 * Função para parar o servidor graciosamente
 */
async function gracefulShutdown() {
  try {
    console.log('🛑 Parando servidor...');
    await server.close();
    await disconnectDatabase();
    console.log('✅ Servidor parado com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao parar servidor:', error);
    process.exit(1);
  }
}

/**
 * Eventos de shutdown
 */
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Tratamento de erros não capturados
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  gracefulShutdown();
});

/**
 * Inicialização da aplicação
 */
async function main() {
  await setupServer();
  await startServer();
}

// Inicia a aplicação
main().catch((error) => {
  console.error('❌ Erro fatal na inicialização:', error);
  process.exit(1);
});
