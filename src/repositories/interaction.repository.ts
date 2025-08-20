import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { InteractionType } from '../schemas/interaction.schema';

/**
 * Repository responsável pela camada de abstração para operações de Interaction
 * Acessa diretamente o banco de dados e implementa validações de negócio
 * Esta é a camada de persistência de dados
 */
export class InteractionRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  /**
   * Cria uma nova interação
   * @param interaction - Dados da interação sem ID
   * @returns Promise com a interação criada
   */
  async create(interaction: Omit<InteractionType, 'id'>): Promise<InteractionType> {
    // Validações adicionais podem ser feitas aqui
    if (!interaction.user_id || !interaction.ticket_id || !interaction.message) {
      throw new Error('Dados obrigatórios não fornecidos para criar interação');
    }

    const { data, error } = await this.client
      .from('interactions')
      .insert({
        ...interaction,
        timestamp: interaction.timestamp || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar interação: ${error.message}`);
    }

    return data;
  }

  /**
   * Busca todas as interações de um ticket específico
   * @param ticketId - ID do ticket
   * @returns Promise com array das interações ordenadas por timestamp
   */
  async findByTicketId(ticketId: string): Promise<InteractionType[]> {
    if (!ticketId) {
      throw new Error('ID do ticket é obrigatório');
    }

    const { data, error } = await this.client
      .from('interactions')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar interações: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Busca uma interação específica pelo ID
   * @param id - ID da interação
   * @returns Promise com a interação encontrada
   * @throws Error se a interação não for encontrada
   */
  async findById(id: string): Promise<InteractionType> {
    if (!id) {
      throw new Error('ID da interação é obrigatório');
    }

    const { data, error } = await this.client
      .from('interactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Interação não encontrada');
      }
      throw new Error(`Erro ao buscar interação: ${error.message}`);
    }

    return data;
  }

  /**
   * Busca todas as interações de um usuário específico
   * @param userId - ID do usuário
   * @returns Promise com array das interações do usuário
   */
  async findByUserId(userId: string): Promise<InteractionType[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const { data, error } = await this.client
      .from('interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar interações do usuário: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Atualiza uma interação existente
   * @param id - ID da interação
   * @param updates - Dados a serem atualizados
   * @returns Promise com a interação atualizada
   */
  async update(id: string, updates: Partial<InteractionType>): Promise<InteractionType> {
    if (!id) {
      throw new Error('ID da interação é obrigatório');
    }

    // Verifica se a interação existe antes de atualizar
    await this.findById(id);

    const { data, error } = await this.client
      .from('interactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar interação: ${error.message}`);
    }

    return data;
  }

  /**
   * Remove uma interação
   * @param id - ID da interação a ser removida
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID da interação é obrigatório');
    }

    // Verifica se a interação existe antes de deletar
    await this.findById(id);

    const { error } = await this.client
      .from('interactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar interação: ${error.message}`);
    }
  }

  /**
   * Verifica se uma interação existe
   * @param id - ID da interação
   * @returns Promise<boolean> true se existe, false caso contrário
   */
  async exists(id: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('interactions')
        .select('id')
        .eq('id', id)
        .single();

      return !error && data !== null;
    } catch {
      return false;
    }
  }

  /**
   * Conta o número total de interações de um ticket
   * @param ticketId - ID do ticket
   * @returns Promise com o número de interações
   */
  async countByTicketId(ticketId: string): Promise<number> {
    const interactions = await this.findByTicketId(ticketId);
    return interactions.length;
  }
}
