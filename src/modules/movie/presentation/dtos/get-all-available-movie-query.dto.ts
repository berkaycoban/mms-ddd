import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

import { BaseGetAllQueryDTO } from '@/shared/dtos/base-get-all-query.dto';
import { dayjs } from '@/shared/utils';

export class GetAllAvailableQueryDTO extends BaseGetAllQueryDTO {
  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ format: 'YYYY-MM-DD' })
  date: string = dayjs().format('YYYY-MM-DD');
}
