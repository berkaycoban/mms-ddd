import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '@/shared/decorators/roles.decorator';
import { UserRole } from '@/shared/types';

import { CreateMovieDTO } from './dtos/create-movie.dto';
import { CreateMovieUseCase } from '../application/use-cases/create-movie.use-case';
import { Movie } from '../domain/entities/movie.entity';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  @Post()
  @Roles([UserRole.MANAGER])
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({ type: Movie })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateMovieDTO) {
    return this.createMovieUseCase.execute(body);
  }
}
