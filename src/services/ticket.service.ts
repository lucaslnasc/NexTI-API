import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';

/**
 * Service para gerenciar tickets usando Supabase
 */
export class TicketService {
  /**
   * Cria um novo ticket na tabela 'tickets' e envia para o webhook do n8n
   */
  async createTicket(data: CreateTicketType) {
    // Insere um novo ticket na tabela 'tickets'
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert([{
        user_id: data.userId,
        message: data.message,
        priority: data.priority || 'normal',
        status: 'open',
      }])
      .select()
      .single();
    if (error) throw new Error('Erro ao criar ticket: ' + error.message);
    // Envia para o webhook do n8n (se configurado)
    await this.sendToN8nWebhook(ticket);
    return ticket;
  }

  /**
   * Busca todos os tickets com filtros opcionais
   */
  async getTickets(filters: TicketFiltersType) {
    // Monta filtros para consulta e paginação
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.userId) query = query.eq('user_id', filters.userId);
    const { data: tickets, error, count } = await query;
    if (error) throw new Error('Erro ao buscar tickets: ' + error.message);
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
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !ticket) throw new Error('Ticket não encontrado');
    return ticket;
  }

  /**
   * Atualiza o status de um ticket
   */
  async updateTicketStatus(id: string, data: UpdateTicketStatusType) {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update({ status: data.status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error('Erro ao atualizar ticket: ' + error.message);
    return ticket;
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
