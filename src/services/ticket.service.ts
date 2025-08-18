import axios from 'axios';
import { TicketRepository } from '../repositories/ticket.repository';
import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';

/**
 * Service para gerenciar tickets usando Supabase
 */
export class TicketService {
  private repository: TicketRepository;

  constructor() {
    this.repository = new TicketRepository();
  }
  /**
   * Cria um novo ticket na tabela 'tickets' e envia para o webhook do n8n
   */
  async createTicket(data: CreateTicketType) {
    const ticket = await this.repository.createTicket(data);
    await this.sendToN8nWebhook(ticket);
    return ticket;
  }

  /**
   * Busca todos os tickets com filtros opcionais
   */
  async getTickets(filters: TicketFiltersType) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { tickets, count } = await this.repository.getTickets(filters, from, to);
    return {
      tickets,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Busca um ticket específico por ID
   */
  async getTicketById(id: string) {
    return this.repository.getTicketById(id);
  }

  /**
   * Atualiza o status de um ticket
   */
  async updateTicketStatus(id: string, data: UpdateTicketStatusType) {
    return this.repository.updateTicketStatus(id, data);
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
      await axios.post(webhookUrl, ticket, { timeout: 5000 });
      console.log(`Ticket ${ticket.id} sent to n8n webhook`);
    } catch (error) {
      console.error('Error sending ticket to n8n webhook:', error);
    }
  }
}
