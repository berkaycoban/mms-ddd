import { Inject, Injectable, Logger } from '@nestjs/common';

import { MovieRepository } from '../../domain/repositories/movie.repository';
import { GetAllMovieQueryDTO } from '../../presentation/dtos/get-all-movie-query.dto';
import { GetAllMovieResponse } from '../../presentation/dtos/get-all-movie.response.dto';

@Injectable()
export class GetAllMovieUseCase {
  private readonly logger = new Logger(GetAllMovieUseCase.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute({
    query,
  }: {
    query: GetAllMovieQueryDTO;
  }): Promise<GetAllMovieResponse> {
    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const { totalCount, items } = await this.movieRepository.getAll({
      pagination,
    });

    return new GetAllMovieResponse({
      totalCount,
      items,
    });
  }
}
