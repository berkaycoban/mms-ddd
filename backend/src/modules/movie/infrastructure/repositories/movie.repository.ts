import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { BasePagination, IOrderBy } from '@/shared/types';

import { Movie } from '../../domain/entities/movie.entity';
import { Session } from '../../domain/entities/session.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';

@Injectable()
export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(movie: Movie) {
    const createdMovie = await this.prisma.movie.create({
      data: {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      },
    });

    return new Movie(createdMovie);
  }

  async getAll({
    pagination,
    orderBy,
  }: {
    pagination: BasePagination;
    orderBy: IOrderBy;
  }): Promise<{ totalCount: number; items: Movie[] }> {
    const [totalCount, movies] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.movie.findMany({
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
        orderBy,
      }),
    ]);

    const items: Movie[] = [];

    for (const movie of movies) {
      items.push(new Movie({ ...movie }));
    }

    return { items, totalCount };
  }

  async getAllAvailableMovies({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: { startDate: string; endDate: string; ageRestriction: number };
  }): Promise<{
    totalCount: number;
    items: Movie[];
  }> {
    const whereQuery: Prisma.MovieWhereInput = {
      ageRestriction: {
        lte: filter.ageRestriction,
      },
      Session: {
        some: { date: { gte: filter.startDate, lte: filter.endDate } },
      },
    };

    const [totalCount, movies] = await Promise.all([
      this.prisma.movie.count({
        where: whereQuery,
      }),
      this.prisma.movie.findMany({
        where: whereQuery,
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
        include: { Session: true },
      }),
    ]);

    const items: Movie[] = [];

    for (const movie of movies) {
      const sessions = movie.Session.map((e) => new Session(e));
      if (sessions.length > 0) {
        items.push(new Movie({ ...movie, sessions }));
      }
    }

    return { items, totalCount };
  }

  async getById(movieId: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return null;
    }

    return new Movie(movie);
  }

  async updateById(movieId: string, movie: Movie): Promise<Movie> {
    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      },
    });

    return new Movie(updatedMovie);
  }

  async deleteById(movieId: string): Promise<void> {
    await this.prisma.movie.delete({
      where: { id: movieId },
    });
  }
}
