import { Expose } from 'class-transformer';

import { ITicket, TicketStatus } from '../interfaces/ticket.interface';

export class Ticket implements ITicket {
  @Expose()
  id: string;

  @Expose()
  sessionId: string;

  @Expose()
  userId: string;

  @Expose()
  status: TicketStatus;

  constructor(data: ITicket) {
    Object.assign(this, data);
  }
}
