import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

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
}
