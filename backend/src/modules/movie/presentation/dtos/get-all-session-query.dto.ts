import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

import { BaseGetAllQueryDTO } from '@/shared/dtos/base-get-all-query.dto';

export class GetAllSessionQueryDTO extends BaseGetAllQueryDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  roomNumber?: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ format: 'YYYY-MM-DD' })
  date?: string;
}
