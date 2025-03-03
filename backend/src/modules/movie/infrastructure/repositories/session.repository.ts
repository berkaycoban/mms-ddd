import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { BasePagination } from '@/shared/types';

import { Session } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}
  getAvailableMovies(): Promise<{
    totalCount: number;
    items: { date: Date; roomNumber: number; movieId: string }[];
  }> {
    throw new Error('Method not implemented.');
  }

  async create(session: Session) {
    const createdSession = await this.prisma.session.create({
      data: {
        date: session.date,
        roomNumber: session.roomNumber,
        movieId: session.movieId,
      },
    });

    return new Session(createdSession);
  }

  async isSessionExists({
    date,
    roomNumber,
  }: {
    date: Date;
    roomNumber: number;
  }) {
    const session = await this.prisma.session.findFirst({
      where: { date, roomNumber },
    });

    return !!session;
  }

  async getAll({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: { movieId: string; roomNumber?: number; date?: Date };
  }): Promise<{ totalCount: number; items: Session[] }> {
    const whereQuery: Prisma.SessionWhereInput = {
      movieId: filter.movieId,
    };

    if (filter.roomNumber) {
      whereQuery.roomNumber = filter.roomNumber;
    }

    if (filter.date) {
      whereQuery.date = filter.date;
    }

    const [totalCount, sessions] = await Promise.all([
      this.prisma.session.count({
        where: whereQuery,
      }),
      this.prisma.session.findMany({
        where: whereQuery,
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
      }),
    ]);

    const items: Session[] = [];

    for (const session of sessions) {
      items.push(new Session(session));
    }

    return { items, totalCount };
  }

  async getById(sessionId: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    return new Session(session);
  }
}
