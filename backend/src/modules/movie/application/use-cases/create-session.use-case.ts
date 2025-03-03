import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { dayjs } from '@/shared/utils';

import { Session } from '../../domain/entities/session.entity';
import { SessionRepository } from '../../domain/repositories/session.repository';
import { CreateSessionDTO } from '../../presentation/dtos/create-session.dto';

@Injectable()
export class CreateSessionUseCase {
  private readonly logger = new Logger(CreateSessionUseCase.name);

  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute({
    id,
    body,
  }: {
    id: string;
    body: CreateSessionDTO;
  }): Promise<Session> {
    this.logger.log(`Creating session for movie ${id}`);

    const sessionDate = dayjs.utc(body.date);

    if (sessionDate.isBefore(dayjs.utc(), 'day')) {
      this.logger.log('Session date cannot be in the past');
      throw new BadRequestException('Session date cannot be in the past');
    }

    const sessionTime = body.timeSlot.split(':')[0];
    const newSessionDate = sessionDate
      .set('hour', parseInt(sessionTime, 10))
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();

    const isSessionExists = await this.sessionRepository.isSessionExists({
      date: newSessionDate,
      roomNumber: body.roomNumber,
    });

    if (isSessionExists) {
      this.logger.log('Session is already exists');
      throw new BadRequestException('Session is already exists');
    }

    const session = new Session({
      id: '',
      movieId: id,
      date: newSessionDate,
      roomNumber: body.roomNumber,
    });

    const createdSession = await this.sessionRepository.create(session);

    this.logger.log(`Session created for movie ${id}`);

    return createdSession;
  }
}
