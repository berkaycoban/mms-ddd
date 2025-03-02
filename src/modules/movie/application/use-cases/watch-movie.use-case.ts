import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IGetUser } from '@/shared/types';
import { dayjs } from '@/shared/utils';

import { Watch } from '../../domain/entities/watch.entity';
import { TicketStatus } from '../../domain/interfaces/ticket.interface';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { WatchRepository } from '../../domain/repositories/watch.repository';
import { WatchMovieDTO } from '../../presentation/dtos/watch-movie.dto';

@Injectable()
export class WatchMovieUseCase {
  constructor(
    @Inject('TicketRepository')
    private readonly ticketRepository: TicketRepository,
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
    @Inject('WatchRepository')
    private readonly watchRepository: WatchRepository,
  ) {}

  async execute({
    user,
    body,
  }: {
    user: IGetUser;
    body: WatchMovieDTO;
  }): Promise<Watch> {
    const ticket = await this.ticketRepository.getById(body.ticketId);

    if (
      !ticket ||
      ticket.userId !== user.id ||
      ticket.status === TicketStatus.USED
    ) {
      throw new BadRequestException('Ticket not found!');
    }

    const session = await this.sessionRepository.getById(ticket.sessionId);

    if (!session) {
      throw new BadRequestException('Session not found!');
    }

    const currentDate = dayjs();
    const sessionDate = dayjs.utc(session.date);

    if (sessionDate.isBefore(currentDate)) {
      throw new BadRequestException('Session has not started yet!');
    }

    if (
      sessionDate.isAfter(currentDate) &&
      sessionDate.diff(currentDate, 'h') > 2
    ) {
      ticket.status = TicketStatus.USED;
      await this.ticketRepository.update(ticket);

      throw new BadRequestException('Session has expired!');
    }

    ticket.status = TicketStatus.USED;

    await this.ticketRepository.update(ticket);

    const watch = new Watch({
      id: '',
      userId: user.id,
      ticketId: ticket.id,
      sessionId: session.id,
      movieId: session.movieId,
    });

    const createdWatch = await this.watchRepository.create(watch);
    return createdWatch;
  }
}
