import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

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
}
