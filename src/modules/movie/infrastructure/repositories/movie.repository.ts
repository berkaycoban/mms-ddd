import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

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
        Session: {
          create: movie.sessions.map((session) => ({
            date: session.date,
            timeSlot: session.timeSlot,
            roomNumber: session.roomNumber,
          })),
        },
      },
      include: {
        Session: true,
      },
    });

    const sessions = createdMovie.Session.map(
      (session) => new Session(session),
    ).filter((session) => session);

    return new Movie({ ...createdMovie, sessions });
  }

  async isSessionTaken({
    date,
    timeSlot,
    roomNumber,
  }: {
    date: Date;
    timeSlot: string;
    roomNumber: number;
  }) {
    const session = await this.prisma.session.findFirst({
      where: { date, timeSlot, roomNumber },
    });

    return !!session;
  }

  async getById(movieId: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return null;
    }

    return new Movie({ ...movie, sessions: [] });
  }

  async updateById(movieId: string, movie: Movie): Promise<Movie> {
    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      },
    });

    return new Movie({ ...updatedMovie, sessions: [] });
  }

  async deleteById(movieId: string): Promise<void> {
    await this.prisma.movie.delete({
      where: { id: movieId },
    });
  }
}
