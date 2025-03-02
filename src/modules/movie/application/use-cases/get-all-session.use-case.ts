import { Inject, Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';

import { SessionRepository } from '../../domain/repositories/session.repository';
import { GetAllSessionQueryDTO } from '../../presentation/dtos/get-all-session-query.dto';
import { GetAllSessionResponse } from '../../presentation/dtos/get-all-session.response.dto';

@Injectable()
export class GetAllSessionUseCase {
  private readonly logger = new Logger(GetAllSessionUseCase.name);

  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute({
    movieId,
    query,
  }: {
    movieId: string;
    query: GetAllSessionQueryDTO;
  }): Promise<GetAllSessionResponse> {
    this.logger.log(`Executing use case with movieId: ${movieId}`);

    const filter: {
      movieId: string;
      roomNumber?: number;
      startDate?: string;
      endDate?: string;
    } = {
      movieId,
    };

    if (query.roomNumber) {
      filter.roomNumber = query.roomNumber;
    }

    if (query.date) {
      const date = dayjs(query.date);
      filter.startDate = date.startOf('day').toISOString();
      filter.endDate = date.endOf('day').toISOString();
    }

    const { totalCount, items } = await this.sessionRepository.getAll({
      pagination: { page: query.page, limit: query.limit },
      filter,
    });

    this.logger.log(`Found ${totalCount} sessions`);

    return new GetAllSessionResponse({
      totalCount,
      items,
    });
  }
}
