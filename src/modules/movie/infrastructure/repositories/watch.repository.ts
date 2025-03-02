import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { BasePagination } from '@/shared/types';

import { Movie } from '../../domain/entities/movie.entity';
import { Session } from '../../domain/entities/session.entity';
import { Watch } from '../../domain/entities/watch.entity';
import { WatchRepository } from '../../domain/repositories/watch.repository';

@Injectable()
export class PrismaWatchRepository implements WatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(watch: Watch) {
    const createdWatch = await this.prisma.watch.create({
      data: {
        userId: watch.userId,
        ticketId: watch.ticketId,
        sessionId: watch.sessionId,
        movieId: watch.movieId,
      },
    });

    return new Watch(createdWatch);
  }

  async getAll({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: { userId: string };
  }): Promise<{ totalCount: number; items: Watch[] }> {
    const whereQuery: Prisma.WatchWhereInput = {
      userId: filter.userId,
    };

    const [totalCount, watchHistories] = await Promise.all([
      this.prisma.watch.count({ where: whereQuery }),
      this.prisma.watch.findMany({
        where: whereQuery,
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
        include: {
          session: true,
          movie: true,
        },
      }),
    ]);

    const items: Watch[] = [];

    for (const watchHistory of watchHistories) {
      const movie = new Movie({ ...watchHistory.movie });
      const session = new Session({ ...watchHistory.session });

      items.push(new Watch({ ...watchHistory, movie, session }));
    }

    return { items, totalCount };
  }
}
