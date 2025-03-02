import { Inject, Injectable } from '@nestjs/common';

import { IGetUser } from '@/shared/types';

import { WatchRepository } from '../../domain/repositories/watch.repository';
import { GetWatchHistoryQueryDTO } from '../../presentation/dtos/get-watch-history-query.dto';
import { GetWatchHistoryResponse } from '../../presentation/dtos/get-watch-history.response.dto';

@Injectable()
export class GetWatchHistoryUseCase {
  constructor(
    @Inject('WatchRepository')
    private readonly watchRepository: WatchRepository,
  ) {}

  async execute({
    user,
    query,
  }: {
    user: IGetUser;
    query: GetWatchHistoryQueryDTO;
  }): Promise<GetWatchHistoryResponse> {
    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const filter = {
      userId: user.id,
    };

    const { totalCount, items } = await this.watchRepository.getAll({
      pagination,
      filter,
    });

    return new GetWatchHistoryResponse({
      totalCount,
      items,
    });
  }
}
