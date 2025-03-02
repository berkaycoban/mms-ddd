import { Inject, Injectable, Logger } from '@nestjs/common';

import { dayjs } from '@/shared/utils';

import { MovieRepository } from '../../domain/repositories/movie.repository';
import { GetAllAvailableQueryDTO } from '../../presentation/dtos/get-all-available-movie-query.dto';
import { GetAllMovieResponse } from '../../presentation/dtos/get-all-movie.response.dto';

@Injectable()
export class GetAllAvailableMovie {
  private readonly logger = new Logger(GetAllAvailableMovie.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute({ query }: { query: GetAllAvailableQueryDTO }) {
    let queryDate = dayjs(query.date);

    if (queryDate.isBefore(dayjs())) {
      queryDate = dayjs(); // if the query date is before today, set it to today
    }

    const filter = {
      startDate: queryDate.toISOString(),
      endDate: queryDate.endOf('day').toISOString(),
    };

    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const { totalCount, items } =
      await this.movieRepository.getAllAvailableMovies({ pagination, filter });

    return new GetAllMovieResponse({
      totalCount,
      items,
    });
  }
}
