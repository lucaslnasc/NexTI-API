import { CreateTicketType, TicketFiltersType, UpdateTicketStatusType } from '../schemas/ticket.schema';
import { TicketService } from '../services/ticket.service';

export class TicketUsecase {
  private service: TicketService;

  constructor() {
    this.service = new TicketService();
  }

  async createTicket(data: CreateTicketType) {
    return this.service.createTicket(data);
  }

  async getTickets(filters: TicketFiltersType) {
    return this.service.getTickets(filters);
  }

  async getTicketById(id: string) {
    return this.service.getTicketById(id);
  }

  async updateTicketStatus(id: string, data: UpdateTicketStatusType) {
    return this.service.updateTicketStatus(id, data);
  }
}
