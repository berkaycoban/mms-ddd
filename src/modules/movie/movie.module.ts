import { Module } from '@nestjs/common';

import { BuyTicketUseCase } from './application/use-cases/buy-ticket.use-case';
import { CreateMovieUseCase } from './application/use-cases/create-movie.use-case';
import { CreateSessionUseCase } from './application/use-cases/create-session.use-case';
import { DeleteMovieUseCase } from './application/use-cases/delete-movie.use-case';
import { GetAllAvailableMovie } from './application/use-cases/get-all-available-movie.use-case';
import { GetAllMovieUseCase } from './application/use-cases/get-all-movie.use-case';
import { GetAllSessionUseCase } from './application/use-cases/get-all-session.use-case';
import { UpdateMovieUseCase } from './application/use-cases/update-movie.use-case';
import { PrismaMovieRepository } from './infrastructure/repositories/movie.repository';
import { PrismaSessionRepository } from './infrastructure/repositories/session.repository';
import { PrismaTicketRepository } from './infrastructure/repositories/ticket.repository';
import { MovieController } from './presentation/movie.controller';
import { TicketController } from './presentation/ticket.controller';

@Module({
  controllers: [MovieController, TicketController],
  providers: [
    { provide: 'MovieRepository', useClass: PrismaMovieRepository },
    { provide: 'SessionRepository', useClass: PrismaSessionRepository },
    { provide: 'TicketRepository', useClass: PrismaTicketRepository },

    CreateMovieUseCase,
    GetAllMovieUseCase,
    GetAllAvailableMovie,
    UpdateMovieUseCase,
    DeleteMovieUseCase,

    CreateSessionUseCase,
    GetAllSessionUseCase,

    BuyTicketUseCase,
  ],
})
export class MovieModule {}
