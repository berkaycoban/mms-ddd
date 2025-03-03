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

import { BuyTicketDTO } from './dtos/buy-ticket.dto';
import { BuyTicketUseCase } from '../application/use-cases/buy-ticket.use-case';
import { Ticket } from '../domain/entities/ticket.entity';

@ApiBearerAuth()
@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly buyTicketUseCase: BuyTicketUseCase) {}

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
}
