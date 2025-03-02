import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { Movie } from '../../domain/entities/movie.entity';

export class CreateMovieResponse {
  @Expose()
  @Type(() => Movie)
  movie: Movie;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  errors?: string[];

  constructor(data: CreateMovieResponse) {
    Object.assign(this, data);
  }
}
