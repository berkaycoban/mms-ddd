import { Expose, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { Session } from '../../domain/entities/session.entity';

export class GetAllSessionResponse {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Session)
  items: Session[];

  @Expose()
  @IsNumber()
  totalCount: number;

  constructor(data: GetAllSessionResponse) {
    Object.assign(this, data);
  }
}
