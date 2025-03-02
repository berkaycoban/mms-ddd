import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WatchMovieDTO {
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;
}
