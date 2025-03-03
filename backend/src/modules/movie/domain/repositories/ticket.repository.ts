import { Ticket } from '../entities/ticket.entity';

export interface TicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  isTicketExists({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }): Promise<boolean>;

  getById(ticketId: string): Promise<Ticket | null>;

  update(ticket: Ticket): Promise<void>;
}
