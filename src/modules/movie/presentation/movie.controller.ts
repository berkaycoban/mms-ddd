import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetId } from '@/shared/decorators/get-id.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserRole } from '@/shared/types';

import { CreateMovieDTO } from './dtos/create-movie.dto';
import { DeleteMovieResponseDto } from './dtos/delete-movie.response.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { UpdateMovieResponseDTO } from './dtos/update-movie.response.dto';
import { CreateMovieUseCase } from '../application/use-cases/create-movie.use-case';
import { DeleteMovieUseCase } from '../application/use-cases/delete-movie.use-case';
import { UpdateMovieUseCase } from '../application/use-cases/update-movie.use-case';
import { Movie } from '../domain/entities/movie.entity';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Post()
  @Roles([UserRole.MANAGER])
  @ApiOperation({
    summary: 'Create a new movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({ type: Movie })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateMovieDTO) {
    return this.createMovieUseCase.execute(body);
  }

  @Put(':id')
  @Roles([UserRole.MANAGER])
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    summary: 'Update a movie',
    description: 'Only accessible by MANAGER role.',
  })
  @ApiOkResponse({ type: UpdateMovieResponseDTO })
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
