import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { IOrderBy } from '../types';

export class BaseGetAllQueryDTO {
  @ApiPropertyOptional({ type: 'string', example: '0', minimum: 0 })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page = 0;

  @ApiPropertyOptional({
    type: 'string',
    example: '10',
    minimum: 0,
    maximum: 100,
  })
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({ type: 'string', example: '-updatedAt' })
  @Expose()
  @IsOptional()
  @IsString()
  sortBy?: string = '-updatedAt';

  @ApiHideProperty()
  orderBy: IOrderBy;
}
