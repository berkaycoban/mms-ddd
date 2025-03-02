import { Module } from '@nestjs/common';

import { CreateMovieUseCase } from './application/use-cases/create-movie.use-case';
import { CreateSessionUseCase } from './application/use-cases/create-session.use-case';
import { DeleteMovieUseCase } from './application/use-cases/delete-movie.use-case';
import { GetAllAvailableMovie } from './application/use-cases/get-all-available-movie.use-case';
import { GetAllMovieUseCase } from './application/use-cases/get-all-movie.use-case';
import { GetAllSessionUseCase } from './application/use-cases/get-all-session.use-case';
import { UpdateMovieUseCase } from './application/use-cases/update-movie.use-case';
import { PrismaMovieRepository } from './infrastructure/repositories/movie.repository';
import { PrismaSessionRepository } from './infrastructure/repositories/session.repository';
import { MovieController } from './presentation/movie.controller';

@Module({
  controllers: [MovieController],
  providers: [
    { provide: 'MovieRepository', useClass: PrismaMovieRepository },
    { provide: 'SessionRepository', useClass: PrismaSessionRepository },
    CreateMovieUseCase,
    CreateSessionUseCase,
    GetAllMovieUseCase,
    GetAllAvailableMovie,
    GetAllSessionUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase,
  ],
})
export class MovieModule {}
