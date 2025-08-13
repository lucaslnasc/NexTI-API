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
    // Monta filtros para consulta
    const { page = 1, limit = 10, status, priority, userId } = filters;
    const query = supabase.from('tickets').select('*');
    if (status) query.eq('status', status);
    if (priority) query.eq('priority', priority);
    if (userId) query.eq('user_id', userId);
    query.order('created_at', { ascending: false });
    query.range((page - 1) * limit, page * limit - 1);
    const { data: tickets, error } = await query;
    if (error) throw new Error('Erro ao buscar tickets: ' + error.message);
    return tickets;
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
