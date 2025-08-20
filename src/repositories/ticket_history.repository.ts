import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { TicketHistoryType } from '../schemas/ticket_history.schema';

/**
 * Repository responsável pela camada de abstração para operações de Ticket History
 * Acessa diretamente o banco de dados e implementa regras de negócio específicas
 * para histórico de tickets
 */
export class TicketHistoryRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  /**
   * Cria uma nova entrada no histórico do ticket
   * @param historyEntry - Dados da entrada de histórico sem ID
   * @returns Promise com a entrada criada
   */
  async create(historyEntry: Omit<TicketHistoryType, 'id'>): Promise<TicketHistoryType> {
    // Validações adicionais podem ser feitas aqui
    if (!historyEntry.ticket_id || !historyEntry.status || !historyEntry.changed_by) {
      throw new Error('Dados obrigatórios não fornecidos para criar entrada no histórico');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .insert({
        ...historyEntry,
        changed_at: historyEntry.changed_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar entrada no histórico: ${error.message}`);
    }

    return data;
  }

  /**
   * Busca todo o histórico de um ticket específico
   * @param ticketId - ID do ticket
   * @returns Promise com array do histórico ordenado cronologicamente
   */
  async findByTicketId(ticketId: string): Promise<TicketHistoryType[]> {
    if (!ticketId) {
      throw new Error('ID do ticket é obrigatório');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('changed_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar histórico do ticket: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Busca uma entrada específica do histórico pelo ID
   * @param id - ID da entrada do histórico
   * @returns Promise com a entrada encontrada
   * @throws Error se a entrada não for encontrada
   */
  async findById(id: string): Promise<TicketHistoryType> {
    if (!id) {
      throw new Error('ID da entrada do histórico é obrigatório');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Entrada do histórico não encontrada');
      }
      throw new Error(`Erro ao buscar entrada do histórico: ${error.message}`);
    }

    return data;
  }

  /**
   * Busca histórico de tickets alterados por um usuário específico
   * @param userId - ID do usuário que fez as alterações
   * @returns Promise com array do histórico de alterações do usuário
   */
  async findByChangedBy(userId: string): Promise<TicketHistoryType[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .select('*')
      .eq('changed_by', userId)
      .order('changed_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórico por usuário: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Busca histórico por status específico
   * @param status - Status do ticket
   * @returns Promise com array das mudanças para esse status
   */
  async findByStatus(status: string): Promise<TicketHistoryType[]> {
    if (!status) {
      throw new Error('Status é obrigatório');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .select('*')
      .eq('status', status)
      .order('changed_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórico por status: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Busca histórico com filtros de data
   * @param startDate - Data de início (ISO string)
   * @param endDate - Data de fim (ISO string)
   * @returns Promise com array do histórico no período
   */
  async findByDateRange(startDate: string, endDate: string): Promise<TicketHistoryType[]> {
    if (!startDate || !endDate) {
      throw new Error('Datas de início e fim são obrigatórias');
    }

    // Valida se as datas são válidas
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Datas fornecidas são inválidas');
    }

    if (start > end) {
      throw new Error('Data de início não pode ser maior que data de fim');
    }

    const { data, error } = await this.client
      .from('ticket_history')
      .select('*')
      .gte('changed_at', startDate)
      .lte('changed_at', endDate)
      .order('changed_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórico por período: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Atualiza uma entrada do histórico (raramente usado)
   * @param id - ID da entrada do histórico
   * @param updates - Dados a serem atualizados
   * @returns Promise com a entrada atualizada
   */
  async update(id: string, updates: Partial<TicketHistoryType>): Promise<TicketHistoryType> {
    if (!id) {
      throw new Error('ID da entrada do histórico é obrigatório');
    }

    // Verifica se a entrada existe antes de atualizar
    await this.findById(id);

    const { data, error } = await this.client
      .from('ticket_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar entrada do histórico: ${error.message}`);
    }

    return data;
  }

  /**
   * Remove uma entrada do histórico (usar com cuidado)
   * @param id - ID da entrada a ser removida
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID da entrada do histórico é obrigatório');
    }

    // Verifica se a entrada existe antes de deletar
    await this.findById(id);

    const { error } = await this.client
      .from('ticket_history')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar entrada do histórico: ${error.message}`);
    }
  }

  /**
   * Verifica se uma entrada do histórico existe
   * @param id - ID da entrada
   * @returns Promise<boolean> true se existe, false caso contrário
   */
  async exists(id: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('ticket_history')
        .select('id')
        .eq('id', id)
        .single();

      return !error && data !== null;
    } catch {
      return false;
    }
  }

  /**
   * Conta o número total de entradas no histórico de um ticket
   * @param ticketId - ID do ticket
   * @returns Promise com o número de entradas no histórico
   */
  async countByTicketId(ticketId: string): Promise<number> {
    const history = await this.findByTicketId(ticketId);
    return history.length;
  }

  /**
   * Busca a última entrada do histórico de um ticket
   * @param ticketId - ID do ticket
   * @returns Promise com a última entrada ou null se não houver histórico
   */
  async findLatestByTicketId(ticketId: string): Promise<TicketHistoryType | null> {
    const history = await this.findByTicketId(ticketId);
    return history.length > 0 ? history[history.length - 1] : null;
  }
}