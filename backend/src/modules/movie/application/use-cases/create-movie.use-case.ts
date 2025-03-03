import { Inject, Injectable, Logger } from '@nestjs/common';

import { Movie } from '../../domain/entities/movie.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { CreateMovieDTO } from '../../presentation/dtos/create-movie.dto';

@Injectable()
export class CreateMovieUseCase {
  private readonly logger = new Logger(CreateMovieUseCase.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute(body: CreateMovieDTO): Promise<Movie> {
    this.logger.log(`Creating movie with title: ${body.name}`);

    const movie = new Movie({ ...body, id: '' });
    const createdMovie = await this.movieRepository.create(movie);

    this.logger.log(`Movie with title ${createdMovie.name} created`);

    return createdMovie;
  }
}
