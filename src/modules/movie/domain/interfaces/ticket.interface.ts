import { TicketStatus as PrismaTicketStatus } from '@prisma/client';

export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
}
export interface ITicket {
  id: string;

  sessionId: string;
  userId: string;

  status: TicketStatus | PrismaTicketStatus;
}
