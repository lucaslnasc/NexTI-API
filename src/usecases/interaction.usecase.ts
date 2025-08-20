import { InteractionRepository } from '../repositories/interaction.repository';
import { InteractionType } from '../schemas/interaction.schema';

/**
 * UseCase responsável pelas regras de negócio relacionadas às Interactions
 * Esta camada contém a lógica de negócio e orquestra as operações
 * entre diferentes repositories quando necessário
 */
export class InteractionUseCase {
  private interactionRepository: InteractionRepository;

  constructor() {
    this.interactionRepository = new InteractionRepository();
  }

  /**
   * Cria uma nova interação (mensagem) em um ticket
   * @param interactionData - Dados da interação a ser criada
   * @returns Promise com a interação criada
   */
  async createInteraction(interactionData: Omit<InteractionType, 'id'>): Promise<InteractionType> {
    try {
      // Validações de negócio específicas
      if (!interactionData.message.trim()) {
        throw new Error('Mensagem da interação não pode estar vazia');
      }

      if (interactionData.message.length > 5000) {
        throw new Error('Mensagem da interação não pode exceder 5000 caracteres');
      }

      // Define valores padrão se não fornecidos
      const interaction = {
        ...interactionData,
        sent_by: interactionData.sent_by || 'system',
        channel: interactionData.channel || 'web',
        timestamp: interactionData.timestamp || new Date().toISOString(),
      };

      return await this.interactionRepository.create(interaction);
    } catch (error: any) {
      throw new Error(`Erro ao criar interação: ${error.message}`);
    }
  }

  /**
   * Busca todas as interações de um ticket específico
   * Útil para exibir o histórico de conversas de um ticket
   * @param ticketId - ID do ticket
   * @returns Promise com array das interações ordenadas cronologicamente
   */
  async getInteractionsByTicketId(ticketId: string): Promise<InteractionType[]> {
    try {
      if (!ticketId) {
        throw new Error('ID do ticket é obrigatório');
      }

      const interactions = await this.interactionRepository.findByTicketId(ticketId);

      // Adiciona lógica de negócio: pode filtrar interações sensíveis, etc.
      return interactions;
    } catch (error: any) {
      throw new Error(`Erro ao buscar interações do ticket: ${error.message}`);
    }
  }

  /**
   * Busca uma interação específica pelo ID
   * @param id - ID da interação
   * @returns Promise com a interação encontrada
   */
  async getInteractionById(id: string): Promise<InteractionType> {
    try {
      if (!id) {
        throw new Error('ID da interação é obrigatório');
      }

      return await this.interactionRepository.findById(id);
    } catch (error: any) {
      throw new Error(`Erro ao buscar interação: ${error.message}`);
    }
  }

  /**
   * Busca todas as interações de um usuário específico
   * Útil para auditoria ou relatórios de atividade do usuário
   * @param userId - ID do usuário
   * @returns Promise com array das interações do usuário
   */
  async getInteractionsByUserId(userId: string): Promise<InteractionType[]> {
    try {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório');
      }

      return await this.interactionRepository.findByUserId(userId);
    } catch (error: any) {
      throw new Error(`Erro ao buscar interações do usuário: ${error.message}`);
    }
  }

  /**
   * Atualiza uma interação existente
   * Permite edição de mensagens (com controles de negócio)
   * @param id - ID da interação
   * @param updates - Dados a serem atualizados
   * @returns Promise com a interação atualizada
   */
  async updateInteraction(id: string, updates: Partial<InteractionType>): Promise<InteractionType> {
    try {
      if (!id) {
        throw new Error('ID da interação é obrigatório');
      }

      // Regras de negócio para atualização
      if (updates.message !== undefined) {
        if (!updates.message.trim()) {
          throw new Error('Mensagem não pode estar vazia');
        }
        if (updates.message.length > 5000) {
          throw new Error('Mensagem não pode exceder 5000 caracteres');
        }
      }

      // Verifica se a interação existe
      const existingInteraction = await this.interactionRepository.findById(id);

      // Regra de negócio: pode verificar se o usuário tem permissão para editar
      // Por exemplo, apenas o próprio usuário ou admins podem editar

      return await this.interactionRepository.update(id, updates);
    } catch (error: any) {
      throw new Error(`Erro ao atualizar interação: ${error.message}`);
    }
  }

  /**
   * Remove uma interação
   * @param id - ID da interação a ser removida
   * @returns Promise<void>
   */
  async deleteInteraction(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID da interação é obrigatório');
      }

      // Verifica se a interação existe antes de deletar
      await this.interactionRepository.findById(id);

      await this.interactionRepository.delete(id);
    } catch (error: any) {
      throw new Error(`Erro ao deletar interação: ${error.message}`);
    }
  }

  /**
   * Conta o número de interações de um ticket
   * Útil para estatísticas e relatórios
   * @param ticketId - ID do ticket
   * @returns Promise com o número de interações
   */
  async countInteractionsByTicketId(ticketId: string): Promise<number> {
    try {
      if (!ticketId) {
        throw new Error('ID do ticket é obrigatório');
      }

      return await this.interactionRepository.countByTicketId(ticketId);
    } catch (error: any) {
      throw new Error(`Erro ao contar interações: ${error.message}`);
    }
  }

  /**
   * Adiciona uma resposta automática do sistema
   * @param ticketId - ID do ticket
   * @param message - Mensagem automática
   * @param userId - ID do usuário que recebe a resposta
   * @returns Promise com a interação criada
   */
  async addSystemResponse(ticketId: string, message: string, userId: string): Promise<InteractionType> {
    try {
      const systemInteraction = {
        user_id: userId,
        ticket_id: ticketId,
        message,
        sent_by: 'system',
        channel: 'auto',
        timestamp: new Date().toISOString(),
      };

      return await this.createInteraction(systemInteraction);
    } catch (error: any) {
      throw new Error(`Erro ao adicionar resposta do sistema: ${error.message}`);
    }
  }
}
