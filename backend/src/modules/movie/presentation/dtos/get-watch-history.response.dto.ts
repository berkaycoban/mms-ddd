import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Watch } from '../../domain/entities/watch.entity';

export class GetWatchHistoryResponse {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Watch)
  items: Watch[];

  @Expose()
  totalCount: number;

  constructor(data: GetWatchHistoryResponse) {
    Object.assign(this, data);
  }
}
