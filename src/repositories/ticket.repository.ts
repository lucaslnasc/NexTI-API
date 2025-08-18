import { supabase } from '../lib/supabase';
import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';

export class TicketRepository {
  async createTicket(data: CreateTicketType) {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert([data])
      .select()
      .single();
    if (error) throw new Error('Erro ao criar ticket: ' + error.message);
    return ticket;
  }

  async getTickets(filters: TicketFiltersType, from: number, to: number) {
    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    const filterFields: [keyof TicketFiltersType, any][] = [
      ['status', filters.status],
      ['priority', filters.priority],
      ['category', filters.category],
      ['assigned_to', filters.assigned_to],
      ['user_id', filters.user_id],
    ];
    filterFields.forEach(([field, value]) => {
      if (typeof value !== 'undefined' && value !== null) {
        query = query.eq(String(field), value);
      }
    });
    const { data: tickets, error, count } = await query;
    if (error) throw new Error('Erro ao buscar tickets: ' + error.message);
    return { tickets, count };
  }

  async getTicketById(id: string) {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !ticket) throw new Error('Ticket não encontrado');
    return ticket;
  }

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
}
