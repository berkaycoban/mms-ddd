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

import { GetOrderBy } from '@/shared/decorators/get-order-by.decorator';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { IGetUser, IOrderBy, UserRole } from '@/shared/types';

import { BuyTicketDTO } from './dtos/buy-ticket.dto';
import { GetAllTicketQueryDTO } from './dtos/get-all-ticket-query.dto';
import { GetAllTicketResponse } from './dtos/get-all-ticket.response.dto';
import { BuyTicketUseCase } from '../application/use-cases/buy-ticket.use-case';
import { GetAllTicketUseCase } from '../application/use-cases/get-all-ticket.use-case';
import { Ticket } from '../domain/entities/ticket.entity';

@ApiBearerAuth()
@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly buyTicketUseCase: BuyTicketUseCase,
    private readonly getAllTicketUseCase: GetAllTicketUseCase,
  ) {}

  @Post()
  @Roles([UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Buy a ticket' })
  @ApiCreatedResponse({ type: Ticket })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: IGetUser, @Body() body: BuyTicketDTO) {
    return this.buyTicketUseCase.execute({ user, body });
  }

  @Get()
  @ApiOkResponse({ type: GetAllTicketResponse })
  @ApiOperation({ summary: 'Get all tickets' })
  @HttpCode(HttpStatus.OK)
  getAllMovies(
    @GetUser() user: IGetUser,
    @Query() query: GetAllTicketQueryDTO,
    @GetOrderBy() orderBy: IOrderBy,
  ) {
    return this.getAllTicketUseCase.execute({
      user,
      query: { ...query, orderBy },
    });
  }
}
