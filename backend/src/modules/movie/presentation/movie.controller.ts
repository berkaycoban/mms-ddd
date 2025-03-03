import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetId } from '@/shared/decorators/get-id.decorator';
import { GetOrderBy } from '@/shared/decorators/get-order-by.decorator';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { IGetUser, IOrderBy, UserRole } from '@/shared/types';

import { CreateMovieDTO } from './dtos/create-movie.dto';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { DeleteMovieResponseDto } from './dtos/delete-movie.response.dto';
import { GetAllAvailableQueryDTO } from './dtos/get-all-available-movie-query.dto';
import { GetAllMovieQueryDTO } from './dtos/get-all-movie-query.dto';
import { GetAllMovieResponse } from './dtos/get-all-movie.response.dto';
import { GetAllSessionQueryDTO } from './dtos/get-all-session-query.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { UpdateMovieResponseDTO } from './dtos/update-movie.response.dto';
import { CreateMovieUseCase } from '../application/use-cases/create-movie.use-case';
import { CreateSessionUseCase } from '../application/use-cases/create-session.use-case';
import { DeleteMovieUseCase } from '../application/use-cases/delete-movie.use-case';
import { GetAllAvailableMovie } from '../application/use-cases/get-all-available-movie.use-case';
import { GetAllMovieUseCase } from '../application/use-cases/get-all-movie.use-case';
import { GetAllSessionUseCase } from '../application/use-cases/get-all-session.use-case';
import { UpdateMovieUseCase } from '../application/use-cases/update-movie.use-case';
import { Movie } from '../domain/entities/movie.entity';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly getAllMovieUseCase: GetAllMovieUseCase,
    private readonly getAllAvailableMovieUseCase: GetAllAvailableMovie,
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly getAllSessionUseCase: GetAllSessionUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Post()
  @Roles([UserRole.MANAGER])
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiCreatedResponse({ type: Movie })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateMovieDTO) {
    return this.createMovieUseCase.execute(body);
  }

  @Get()
  @Roles([UserRole.MANAGER])
  @ApiOkResponse({ type: GetAllMovieResponse })
  @ApiOperation({ summary: 'Get all movies' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  getAllMovies(
    @Query() query: GetAllMovieQueryDTO,
    @GetOrderBy() orderBy: IOrderBy,
  ) {
    return this.getAllMovieUseCase.execute({ query: { ...query, orderBy } });
  }

  @Get('/available')
  @ApiOkResponse({ type: GetAllMovieResponse })
  @ApiOperation({ summary: 'Get all available movies' })
  @HttpCode(HttpStatus.OK)
  getAllAvailableMovies(
    @GetUser() user: IGetUser,
    @Query() query: GetAllAvailableQueryDTO,
  ) {
    return this.getAllAvailableMovieUseCase.execute({ user, query });
  }

  @Post(':id/sessions')
  @Roles([UserRole.MANAGER])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    summary: 'Create sessions for a movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiCreatedResponse({ type: Movie })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  createSessions(@GetId() id: string, @Body() body: CreateSessionDTO) {
    return this.createSessionUseCase.execute({ id, body });
  }

  @Get(':id/sessions')
  @Roles([UserRole.MANAGER])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    summary: 'Get all sessions by movie id',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({ type: GetAllMovieResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  getAllSessionByMovieId(
    @GetId() movieId: string,
    @Query() query: GetAllSessionQueryDTO,
  ) {
    return this.getAllSessionUseCase.execute({ movieId, query });
  }

  @Put(':id')
  @Roles([UserRole.MANAGER])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    summary: 'Update a movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({ type: UpdateMovieResponseDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  updateById(@GetId() id: string, @Body() body: UpdateMovieDTO) {
    return this.updateMovieUseCase.execute({ id, body });
  }

  @Delete(':id')
  @Roles([UserRole.MANAGER])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    summary: 'Delete a movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({
    description: 'Movie deleted successfully',
    type: DeleteMovieResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Movie not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  deleteById(@GetId() id: string) {
    return this.deleteMovieUseCase.execute({ id });
  }
}
