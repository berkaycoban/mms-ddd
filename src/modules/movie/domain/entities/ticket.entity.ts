import { TicketStatus as PrismaTicketStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

import { BaseEntity } from '@/shared/entities/base.entity';

import { ITicket, TicketStatus } from '../interfaces/ticket.interface';

export class Ticket extends BaseEntity<ITicket> {
  @Expose()
  sessionId: string;

  @Expose()
  userId: string;

  @Expose()
  status: TicketStatus | PrismaTicketStatus;

  constructor(data: Ticket) {
    super(data);
    Object.assign(this, data);
  }
}
