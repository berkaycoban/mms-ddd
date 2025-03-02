import { Module } from '@nestjs/common';

import { CreateMovieUseCase } from './application/use-cases/create-movie.use-case';
import { DeleteMovieUseCase } from './application/use-cases/delete-movie.use-case';
import { PrismaMovieRepository } from './infrastructure/repositories/movie.repository';
import { MovieController } from './presentation/movie.controller';

@Module({
  controllers: [MovieController],
  providers: [
    { provide: 'MovieRepository', useClass: PrismaMovieRepository },
    CreateMovieUseCase,
    DeleteMovieUseCase,
  ],
})
export class MovieModule {}
