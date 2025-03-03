import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

import { BaseGetAllQueryDTO } from '@/shared/dtos/base-get-all-query.dto';
import { UserRole } from '@/shared/types';

export class GetAllTicketQueryDTO extends BaseGetAllQueryDTO {
  @Expose({ groups: [UserRole.MANAGER] })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
