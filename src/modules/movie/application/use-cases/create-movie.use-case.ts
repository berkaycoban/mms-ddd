import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { Movie } from '../../domain/entities/movie.entity';
import { Session } from '../../domain/entities/session.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { CreateMovieDTO } from '../../presentation/dtos/create-movie.dto';
import { CreateMovieResponse } from '../../presentation/dtos/create-movie.response.dto';

@Injectable()
export class CreateMovieUseCase {
  private readonly logger = new Logger(CreateMovieUseCase.name);

  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
  ) {}

  async execute(body: CreateMovieDTO): Promise<CreateMovieResponse> {
    this.logger.log(`Creating movie with title: ${body.name}`);

    const sessions: Session[] = [];
    const errors: string[] = [];

    for (const session of body.sessions) {
      if (session.date < new Date()) {
        errors.push(
          `Session at ${session.date.toISOString()}, ${session.timeSlot} in room ${session.roomNumber} is in the past`,
        );

        continue;
      }

      // TODO: Check if the session is in the past and add an error to the errors array

      const isSessionTaken = await this.movieRepository.isSessionTaken({
        date: session.date,
        roomNumber: session.roomNumber,
        timeSlot: session.timeSlot,
      });

      if (isSessionTaken) {
        errors.push(
          `Session at ${session.date.toISOString()}, ${session.timeSlot} in room ${session.roomNumber} is already taken`,
        );

        continue;
      }

      sessions.push(
        new Session({
          id: '',
          date: session.date,
          roomNumber: session.roomNumber,
          timeSlot: session.timeSlot,
        }),
      );
    }

    if (sessions.length === 0) {
      throw new BadRequestException(`No valid sessions provided!`);
    }

    const movie = new Movie({ ...body, id: '', sessions });
    const createdMovie = await this.movieRepository.create(movie);

    this.logger.log(`Movie with title ${createdMovie.name} created`);

    return new CreateMovieResponse({ movie: createdMovie, errors });
  }
}
