import axios from 'axios';
import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';
import { prisma } from '@/lib/prisma';

/**
 * Service para gerenciar tickets
 */
export class TicketService {
  /**
   * Cria um novo ticket no banco de dados e envia para o webhook do n8n
   */
  async createTicket(data: CreateTicketType) {
    try {
      // Salva o ticket no banco de dados
      const ticket = await prisma.ticket.create({
        data: {
          userId: data.userId,
          message: data.message,
          priority: data.priority || 'normal',
          status: 'open',
        },
        include: {
          user: true, // Inclui dados do usuário
        },
      });

      // Envia para o webhook do n8n (se configurado)
      await this.sendToN8nWebhook(ticket);

      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Internal server error while creating ticket');
    }
  }

  /**
   * Busca todos os tickets com filtros opcionais
   */
  async getTickets(filters: TicketFiltersType) {
    try {
      const { page, limit, status, priority, userId } = filters;

      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (userId) where.userId = userId;

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: true, // Inclui dados do usuário
          },
        }),
        prisma.ticket.count({ where }),
      ]);

      return {
        tickets,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new Error('Internal server error while fetching tickets');
    }
  }

  /**
   * Busca um ticket específico por ID
   */
  async getTicketById(id: string) {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          user: true, // Inclui dados do usuário
        },
      });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um ticket
   */
  async updateTicketStatus(id: string, data: UpdateTicketStatusType) {
    try {
      const ticket = await prisma.ticket.update({
        where: { id },
        data: { status: data.status },
        include: {
          user: true, // Inclui dados do usuário
        },
      });

      return ticket;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw new Error('Internal server error while updating ticket');
    }
  }

  /**
   * Envia dados do ticket para o webhook do n8n
   */
  private async sendToN8nWebhook(ticket: any) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('N8n webhook URL not configured');
      return;
    }

    try {
      await axios.post(webhookUrl, {
        ticketId: ticket.id,
        userId: ticket.userId,
        message: ticket.message,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        user: ticket.user,
      }, {
        timeout: 5000, // 5 segundos de timeout
      });

      console.log(`Ticket ${ticket.id} sent to n8n webhook`);
    } catch (error) {
      console.error('Error sending ticket to n8n webhook:', error);
      // Não relança o erro para não falhar a criação do ticket
    }
  }
}
