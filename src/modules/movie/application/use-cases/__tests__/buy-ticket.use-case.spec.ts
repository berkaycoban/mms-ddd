import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IGetUser, UserRole } from '@/shared/types';

import { Session } from '../../../domain/entities/session.entity';
import { Ticket } from '../../../domain/entities/ticket.entity';
import { SessionRepository } from '../../../domain/repositories/session.repository';
import { TicketRepository } from '../../../domain/repositories/ticket.repository';
import { BuyTicketDTO } from '../../../presentation/dtos/buy-ticket.dto';
import { BuyTicketUseCase } from '../buy-ticket.use-case';

describe('BuyTicketUseCase', () => {
  let buyTicketUseCase: BuyTicketUseCase;
  let sessionRepository: jest.Mocked<SessionRepository>;
  let ticketRepository: jest.Mocked<TicketRepository>;

  beforeEach(async () => {
    const mockSessionRepository = {
      getById: jest.fn(),
    };
    const mockTicketRepository = {
      create: jest.fn(),
      isTicketExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyTicketUseCase,
        { provide: 'SessionRepository', useValue: mockSessionRepository },
        { provide: 'TicketRepository', useValue: mockTicketRepository },
      ],
    }).compile();

    buyTicketUseCase = module.get<BuyTicketUseCase>(BuyTicketUseCase);
    sessionRepository = module.get('SessionRepository');
    ticketRepository = module.get('TicketRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should buy a ticket successfully with valid session', async () => {
    const user: IGetUser = {
      id: 'user-uuid',
      username: 'mock-username',
      age: 25,
      role: UserRole.CUSTOMER,
    };
    const buyTicketDto: BuyTicketDTO = { sessionId: 'session-uuid' };
    const session = new Session({
      id: 'session-uuid',
      movieId: 'movie-uuid',
      date: new Date('2025-03-10T10:00:00Z'),
      roomNumber: 123,
    });

    const expectedTicket = new Ticket({
      id: 'ticket-uuid',
      userId: 'user-uuid',
      sessionId: 'session-uuid',
    });

    sessionRepository.getById.mockResolvedValue(session);
    ticketRepository.isTicketExists.mockResolvedValue(false);
    ticketRepository.create.mockResolvedValue(expectedTicket);

    const result = await buyTicketUseCase.execute({ user, body: buyTicketDto });

    expect(result).toEqual(expectedTicket);
  });

  it('should throw BadRequestException if session does not exist', async () => {
    const user: IGetUser = {
      id: 'user-uuid',
      username: 'mock-username',
      age: 25,
      role: UserRole.CUSTOMER,
    };

    const buyTicketDto: BuyTicketDTO = { sessionId: 'non-existent-uuid' };

    sessionRepository.getById.mockResolvedValue(null);

    await expect(
      buyTicketUseCase.execute({ user, body: buyTicketDto }),
    ).rejects.toThrow(new BadRequestException('Session not found'));
  });

  it('should throw BadRequestException if session is expired', async () => {
    const user: IGetUser = {
      id: 'user-uuid',
      username: 'mock-username',
      age: 25,
      role: UserRole.CUSTOMER,
    };

    const buyTicketDto: BuyTicketDTO = { sessionId: 'session-uuid' };
    const session = new Session({
      id: 'session-uuid',
      movieId: 'movie-uuid',
      date: new Date('2020-03-10T10:00:00Z'),
      roomNumber: 123,
    });

    sessionRepository.getById.mockResolvedValue(session);

    await expect(
      buyTicketUseCase.execute({ user, body: buyTicketDto }),
    ).rejects.toThrow(new BadRequestException('Session is expired'));
  });

  it('should throw BadRequestException if ticket already exists', async () => {
    const user: IGetUser = {
      id: 'user-uuid',
      username: 'mock-username',
      age: 25,
      role: UserRole.CUSTOMER,
    };

    const buyTicketDto: BuyTicketDTO = { sessionId: 'session-uuid' };
    const session = new Session({
      id: 'session-uuid',
      movieId: 'movie-uuid',
      date: new Date('2025-03-10T10:00:00Z'),
      roomNumber: 123,
    });

    sessionRepository.getById.mockResolvedValue(session);
    ticketRepository.isTicketExists.mockResolvedValue(true);

    await expect(
      buyTicketUseCase.execute({ user, body: buyTicketDto }),
    ).rejects.toThrow(new BadRequestException('Ticket already exists'));
  });
});
