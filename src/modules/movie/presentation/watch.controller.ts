import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUser } from '@/shared/decorators/get-user.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { IGetUser, UserRole } from '@/shared/types';

import { WatchMovieDTO } from './dtos/watch-movie.dto';
import { WatchMovieUseCase } from '../application/use-cases/watch-movie.use-case';
import { Watch } from '../domain/entities/watch.entity';

@ApiBearerAuth()
@ApiTags('watch')
@Controller('watch')
export class WatchController {
  constructor(private readonly watchMovieUseCase: WatchMovieUseCase) {}

  @Post()
  @Roles([UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Watch a movie' })
  @ApiCreatedResponse({ type: Watch })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: IGetUser, @Body() body: WatchMovieDTO) {
    return this.watchMovieUseCase.execute({ user, body });
  }
}
