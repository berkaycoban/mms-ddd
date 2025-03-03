import { BasePagination, IOrderBy } from '@/shared/types';

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

  getAll({
    pagination,
    orderBy,
    filter,
  }: {
    pagination: BasePagination;
    orderBy: IOrderBy;
    filter: { userId?: string };
  }): Promise<{ totalCount: number; items: Ticket[] }>;

  getById(ticketId: string): Promise<Ticket | null>;

  update(ticket: Ticket): Promise<void>;
}
