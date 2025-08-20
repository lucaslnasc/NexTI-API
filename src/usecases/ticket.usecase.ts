import axios from 'axios';
import { TicketRepository } from '../repositories/ticket.repository';
import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';

/**
 * UseCase responsável pelas regras de negócio relacionadas aos Tickets
 * Esta camada contém a lógica de negócio e orquestra as operações
 * entre diferentes repositories e serviços externos
 */
export class TicketUsecase {
  private repository: TicketRepository;

  constructor() {
    this.repository = new TicketRepository();
  }

  /**
   * Cria um novo ticket e envia para o webhook do N8N
   * @param data - Dados do ticket a ser criado
   * @returns Promise com o ticket criado
   */
  async createTicket(data: CreateTicketType) {
    try {
      // Cria o ticket no banco de dados
      const ticket = await this.repository.createTicket(data);

      // Envia para o webhook do N8N (lógica de negócio)
      await this.sendToN8nWebhook(ticket);

      return ticket;
    } catch (error: any) {
      throw new Error(`Erro ao criar ticket: ${error.message}`);
    }
  }

  /**
   * Busca todos os tickets com filtros e paginação
   * @param filters - Filtros de busca
   * @returns Promise com tickets paginados
   */
  async getTickets(filters: TicketFiltersType) {
    try {
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
    } catch (error: any) {
      throw new Error(`Erro ao buscar tickets: ${error.message}`);
    }
  }

  /**
   * Busca um ticket específico por ID
   * @param id - ID do ticket
   * @returns Promise com o ticket encontrado
   */
  async getTicketById(id: string) {
    try {
      if (!id) {
        throw new Error('ID do ticket é obrigatório');
      }

      return await this.repository.getTicketById(id);
    } catch (error: any) {
      throw new Error(`Erro ao buscar ticket: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de um ticket
   * @param id - ID do ticket
   * @param data - Novos dados de status
   * @returns Promise com o ticket atualizado
   */
  async updateTicketStatus(id: string, data: UpdateTicketStatusType) {
    try {
      if (!id) {
        throw new Error('ID do ticket é obrigatório');
      }

      return await this.repository.updateTicketStatus(id, data);
    } catch (error: any) {
      throw new Error(`Erro ao atualizar status do ticket: ${error.message}`);
    }
  }

  /**
   * Envia dados do ticket para o webhook do N8N
   * Esta é uma regra de negócio específica da aplicação
   * @param ticket - Dados do ticket a ser enviado
   */
  private async sendToN8nWebhook(ticket: any): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('⚠️ N8N webhook URL não configurada - ticket não será enviado para automação');
      return;
    }

    try {
      await axios.post(webhookUrl, ticket, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ Ticket ${ticket.id} enviado para N8N webhook com sucesso`);
    } catch (error: any) {
      console.error(`❌ Erro ao enviar ticket ${ticket.id} para N8N webhook:`, error.message);
      // Não propaga o erro para não falhar a criação do ticket
      // O ticket deve ser criado mesmo se o webhook falhar
    }
  }
}
