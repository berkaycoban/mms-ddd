import { Expose, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { Ticket } from '../../domain/entities/ticket.entity';

export class GetAllTicketResponse {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Ticket)
  items: Ticket[];

  @Expose()
  @IsNumber()
  totalCount: number;

  constructor(data: GetAllTicketResponse) {
    Object.assign(this, data);
  }
}
