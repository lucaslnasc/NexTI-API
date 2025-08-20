import { TicketHistoryRepository } from '../repositories/ticket_history.repository';
import { TicketHistoryType } from '../schemas/ticket_history.schema';

/**
 * UseCase responsável pelas regras de negócio relacionadas ao Ticket History
 * Esta camada contém a lógica de negócio para auditoria e rastreamento
 * de mudanças nos tickets
 */
export class TicketHistoryUseCase {
  private ticketHistoryRepository: TicketHistoryRepository;

  constructor() {
    this.ticketHistoryRepository = new TicketHistoryRepository();
  }

  /**
   * Registra uma mudança no histórico do ticket
   * Sempre chamado quando há alterações nos tickets
   * @param historyData - Dados da entrada de histórico
   * @returns Promise com a entrada criada
   */
  async recordChange(historyData: Omit<TicketHistoryType, 'id'>): Promise<TicketHistoryType> {
    try {
      // Validações de negócio específicas
      if (!historyData.ticket_id || !historyData.status || !historyData.changed_by) {
        throw new Error('Dados obrigatórios não fornecidos para registrar mudança');
      }

      // Define valores padrão se não fornecidos
      const historyEntry = {
        ...historyData,
        changed_at: historyData.changed_at || new Date().toISOString(),
        notes: historyData.notes || `Status alterado para: ${historyData.status}`,
      };

      return await this.ticketHistoryRepository.create(historyEntry);
    } catch (error: any) {
      throw new Error(`Erro ao registrar mudança no histórico: ${error.message}`);
    }
  }

  /**
   * Busca todo o histórico de um ticket específico
   * Útil para auditoria e rastreamento de mudanças
   * @param ticketId - ID do ticket
   * @returns Promise com array do histórico ordenado cronologicamente
   */
  async getHistoryByTicketId(ticketId: string): Promise<TicketHistoryType[]> {
    try {
      if (!ticketId) {
        throw new Error('ID do ticket é obrigatório');
      }

      const history = await this.ticketHistoryRepository.findByTicketId(ticketId);

      // Adiciona lógica de negócio: pode filtrar informações sensíveis
      return history;
    } catch (error: any) {
      throw new Error(`Erro ao buscar histórico do ticket: ${error.message}`);
    }
  }

  /**
   * Busca uma entrada específica do histórico pelo ID
   * @param id - ID da entrada do histórico
   * @returns Promise com a entrada encontrada
   */
  async getHistoryById(id: string): Promise<TicketHistoryType> {
    try {
      if (!id) {
        throw new Error('ID da entrada do histórico é obrigatório');
      }

      return await this.ticketHistoryRepository.findById(id);
    } catch (error: any) {
      throw new Error(`Erro ao buscar entrada do histórico: ${error.message}`);
    }
  }

  /**
   * Busca histórico de tickets alterados por um usuário específico
   * Útil para auditoria de ações de usuários
   * @param userId - ID do usuário que fez as alterações
   * @returns Promise com array do histórico de alterações do usuário
   */
  async getHistoryByChangedBy(userId: string): Promise<TicketHistoryType[]> {
    try {
      if (!userId) {
        throw new Error('ID do usuário é obrigatório');
      }

      return await this.ticketHistoryRepository.findByChangedBy(userId);
    } catch (error: any) {
      throw new Error(`Erro ao buscar histórico por usuário: ${error.message}`);
    }
  }

  /**
   * Busca histórico por status específico
   * Útil para relatórios de mudanças de status
   * @param status - Status do ticket
   * @returns Promise com array das mudanças para esse status
   */
  async getHistoryByStatus(status: string): Promise<TicketHistoryType[]> {
    try {
      if (!status) {
        throw new Error('Status é obrigatório');
      }

      return await this.ticketHistoryRepository.findByStatus(status);
    } catch (error: any) {
      throw new Error(`Erro ao buscar histórico por status: ${error.message}`);
    }
  }

  /**
   * Busca histórico com filtros de data
   * Útil para relatórios em períodos específicos
   * @param startDate - Data de início (ISO string)
   * @param endDate - Data de fim (ISO string)
   * @returns Promise com array do histórico no período
   */
  async getHistoryByDateRange(startDate: string, endDate: string): Promise<TicketHistoryType[]> {
    try {
      if (!startDate || !endDate) {
        throw new Error('Datas de início e fim são obrigatórias');
      }

      return await this.ticketHistoryRepository.findByDateRange(startDate, endDate);
    } catch (error: any) {
      throw new Error(`Erro ao buscar histórico por período: ${error.message}`);
    }
  }

  /**
   * Conta o número de entradas no histórico de um ticket
   * @param ticketId - ID do ticket
   * @returns Promise com o número de entradas no histórico
   */
  async countHistoryByTicketId(ticketId: string): Promise<number> {
    try {
      if (!ticketId) {
        throw new Error('ID do ticket é obrigatório');
      }

      return await this.ticketHistoryRepository.countByTicketId(ticketId);
    } catch (error: any) {
      throw new Error(`Erro ao contar entradas do histórico: ${error.message}`);
    }
  }

  /**
   * Busca a última mudança de um ticket
   * Útil para saber o status atual e quando foi alterado
   * @param ticketId - ID do ticket
   * @returns Promise com a última entrada ou null se não houver histórico
   */
  async getLatestHistoryByTicketId(ticketId: string): Promise<TicketHistoryType | null> {
    try {
      if (!ticketId) {
        throw new Error('ID do ticket é obrigatório');
      }

      return await this.ticketHistoryRepository.findLatestByTicketId(ticketId);
    } catch (error: any) {
      throw new Error(`Erro ao buscar última entrada do histórico: ${error.message}`);
    }
  }

  /**
   * Registra múltiplas mudanças de uma vez (transação)
   * Usado quando um ticket passa por várias alterações simultaneamente
   * @param changes - Array de mudanças a serem registradas
   * @returns Promise com array das entradas criadas
   */
  async recordMultipleChanges(changes: Omit<TicketHistoryType, 'id'>[]): Promise<TicketHistoryType[]> {
    try {
      if (!changes || changes.length === 0) {
        throw new Error('Lista de mudanças não pode estar vazia');
      }

      const results: TicketHistoryType[] = [];

      // Processa cada mudança sequencialmente
      for (const change of changes) {
        const result = await this.recordChange(change);
        results.push(result);
      }

      return results;
    } catch (error: any) {
      throw new Error(`Erro ao registrar múltiplas mudanças: ${error.message}`);
    }
  }

  /**
   * Gera relatório de atividades de um ticket
   * Combina informações de histórico para relatórios
   * @param ticketId - ID do ticket
   * @returns Promise com relatório estruturado
   */
  async generateTicketActivityReport(ticketId: string): Promise<{
    totalChanges: number;
    firstChange: TicketHistoryType | null;
    lastChange: TicketHistoryType | null;
    statusChanges: TicketHistoryType[];
    uniqueUsers: string[];
  }> {
    try {
      const history = await this.getHistoryByTicketId(ticketId);

      return {
        totalChanges: history.length,
        firstChange: history.length > 0 ? history[0] : null,
        lastChange: history.length > 0 ? history[history.length - 1] : null,
        statusChanges: history,
        uniqueUsers: [...new Set(history.map(h => h.changed_by))],
      };
    } catch (error: any) {
      throw new Error(`Erro ao gerar relatório de atividade: ${error.message}`);
    }
  }
}
