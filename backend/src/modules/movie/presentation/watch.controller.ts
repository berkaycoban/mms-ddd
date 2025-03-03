import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUser } from '@/shared/decorators/get-user.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { IGetUser, UserRole } from '@/shared/types';

import { GetWatchHistoryQueryDTO } from './dtos/get-watch-history-query.dto';
import { GetWatchHistoryResponse } from './dtos/get-watch-history.response.dto';
import { WatchMovieDTO } from './dtos/watch-movie.dto';
import { GetWatchHistoryUseCase } from '../application/use-cases/get-watch-history.use-case';
import { WatchMovieUseCase } from '../application/use-cases/watch-movie.use-case';
import { Watch } from '../domain/entities/watch.entity';

@ApiBearerAuth()
@ApiTags('watch')
@Controller('watch')
export class WatchController {
  constructor(
    private readonly watchMovieUseCase: WatchMovieUseCase,
    private readonly getWatchHistoryUseCase: GetWatchHistoryUseCase,
  ) {}

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

  @Get('history')
  @Roles([UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Get user watch history' })
  @ApiOkResponse({ type: GetWatchHistoryResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  getWatchHistory(
    @GetUser() user: IGetUser,
    @Query() query: GetWatchHistoryQueryDTO,
  ) {
    return this.getWatchHistoryUseCase.execute({ user, query });
  }
}
