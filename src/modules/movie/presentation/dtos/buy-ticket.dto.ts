import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class BuyTicketDTO {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;
}
