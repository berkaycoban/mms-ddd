import { Inject, Injectable, Logger } from '@nestjs/common';

import { MovieNotFoundException } from '../../domain/exceptions/movie-not-found.exception';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { UpdateMovieDTO } from '../../presentation/dtos/update-movie.dto';
import { UpdateMovieResponseDTO } from '../../presentation/dtos/update-movie.response.dto';

@Injectable()
export class UpdateMovieUseCase {
  private readonly logger = new Logger(UpdateMovieUseCase.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute({
    id,
    body,
  }: {
    id: string;
    body: UpdateMovieDTO;
  }): Promise<UpdateMovieResponseDTO> {
    this.logger.log(`Updating movie with id: ${id}`);

    const movie = await this.movieRepository.getById(id);

    if (!movie) {
      this.logger.log(`Movie with id ${id} not found`);
      throw new MovieNotFoundException(id);
    }

    movie.name = body.name;
    movie.ageRestriction = body.ageRestriction;

    const updatedMovie = await this.movieRepository.updateById(id, movie);

    this.logger.log(`Movie with id ${id} updated successfully`);

    return new UpdateMovieResponseDTO(updatedMovie);
  }
}
