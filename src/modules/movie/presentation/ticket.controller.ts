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
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetUser } from '@/shared/decorators/get-user.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { IGetUser, UserRole } from '@/shared/types';

import { BuyTicketDTO } from './dtos/buy-ticket.dto';
import { BuyTicketUseCase } from '../application/use-cases/buy-ticket.use-case';

@ApiBearerAuth()
@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly buyTicketUseCase: BuyTicketUseCase) {}

  @Post()
  @Roles([UserRole.CUSTOMER])
  @ApiOperation({ summary: 'Buy a ticket' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: IGetUser, @Body() body: BuyTicketDTO) {
    return this.buyTicketUseCase.execute({ user, body });
  }
}
