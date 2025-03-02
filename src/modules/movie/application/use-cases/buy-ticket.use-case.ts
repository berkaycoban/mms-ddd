import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IGetUser } from '@/shared/types';

import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketStatus } from '../../domain/interfaces/ticket.interface';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { BuyTicketDTO } from '../../presentation/dtos/buy-ticket.dto';

@Injectable()
export class BuyTicketUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
    @Inject('TicketRepository')
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute({
    user,
    body,
  }: {
    user: IGetUser;
    body: BuyTicketDTO;
  }): Promise<Ticket> {
    const session = await this.sessionRepository.getById(body.sessionId);

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    if (session.date < new Date()) {
      throw new BadRequestException('Session is expired');
    }

    const ticket = new Ticket({
      id: '',
      userId: user.id,
      sessionId: session.id,
      status: TicketStatus.ACTIVE,
    });

    const isTicketExists = await this.ticketRepository.isTicketExists(ticket);

    if (isTicketExists) {
      throw new BadRequestException('Ticket already exists');
    }

    const createdTicket = await this.ticketRepository.create(ticket);

    return createdTicket;
  }
}
