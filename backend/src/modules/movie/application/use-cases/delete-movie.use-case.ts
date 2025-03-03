import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MovieNotFoundException } from '../../domain/exceptions/movie-not-found.exception';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { DeleteMovieResponseDto } from '../../presentation/dtos/delete-movie.response.dto';

@Injectable()
export class DeleteMovieUseCase {
  private readonly logger = new Logger(DeleteMovieUseCase.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute({ id }: { id: string }): Promise<DeleteMovieResponseDto> {
    this.logger.log(`Deleting movie with id: ${id}`);

    try {
      await this.movieRepository.deleteById(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new MovieNotFoundException(id);
      }

      throw error;
    }

    this.logger.log(`Movie with id: ${id} deleted successfully`);

    return new DeleteMovieResponseDto({
      message: 'Movie deleted successfully',
    });
  }
}
