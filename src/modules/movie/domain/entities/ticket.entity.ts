import { Expose } from 'class-transformer';

import { ITicket } from '../interfaces/ticket.interface';

export class Ticket implements ITicket {
  @Expose()
  id: string;

  @Expose()
  sessionId: string;

  @Expose()
  userId: string;

  constructor(data: ITicket) {
    Object.assign(this, data);
  }
}
