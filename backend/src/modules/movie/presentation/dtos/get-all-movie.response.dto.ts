import { Expose, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { Movie } from '../../domain/entities/movie.entity';

export class GetAllMovieResponse {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Movie)
  items: Movie[];

  @Expose()
  @IsNumber()
  totalCount: number;

  constructor(data: GetAllMovieResponse) {
    Object.assign(this, data);
  }
}
