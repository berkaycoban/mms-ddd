import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { dayjs } from '@/shared/utils';

import { Session } from '../../../domain/entities/session.entity';
import { SessionRepository } from '../../../domain/repositories/session.repository';
import { CreateSessionDTO } from '../../../presentation/dtos/create-session.dto';
import { TIME_SLOTS } from '../../constants/time-slots';
import { CreateSessionUseCase } from '../create-session.use-case';

jest.mock('@/shared/utils', () => ({
  dayjs: {
    utc: jest.fn(),
  },
}));

describe('CreateSessionUseCase', () => {
  let createSessionUseCase: CreateSessionUseCase;
  let sessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(async () => {
    const mockSessionRepository = {
      create: jest.fn(),
      isSessionExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSessionUseCase,
        { provide: 'SessionRepository', useValue: mockSessionRepository },
      ],
    }).compile();

    createSessionUseCase =
      module.get<CreateSessionUseCase>(CreateSessionUseCase);
    sessionRepository = module.get('SessionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a session successfully with valid data', async () => {
    const movieId = 'movie-uuid';
    const createSessionDto: CreateSessionDTO = {
      date: '2025-03-10',
      timeSlot: TIME_SLOTS['10:00'],
      roomNumber: 123,
    };

    const expectedSession = new Session({
      id: 'session-uuid',
      movieId: 'movie-uuid',
      date: new Date('2025-03-10T10:00:00Z'),
      roomNumber: 123,
    });

    (dayjs.utc as jest.Mock).mockImplementation(() => {
      return {
        isBefore: jest.fn().mockReturnValue(false),
        set: jest.fn().mockImplementation(() => ({
          set: jest.fn().mockReturnThis(),
          toDate: jest.fn().mockReturnValue(new Date('2025-03-10T10:00:00Z')),
        })),
      };
    });

    sessionRepository.isSessionExists.mockResolvedValue(false);
    sessionRepository.create.mockResolvedValue(expectedSession);

    const result = await createSessionUseCase.execute({
      id: movieId,
      body: createSessionDto,
    });

    expect(result).toEqual(expectedSession);
    expect(dayjs.utc).toHaveBeenCalledWith('2025-03-10');
  });

  it('should throw BadRequestException for past session date', async () => {
    const movieId = 'movie-uuid';
    const createSessionDto: CreateSessionDTO = {
      date: '2020-03-10',
      timeSlot: TIME_SLOTS['10:00'],
      roomNumber: 123,
    };

    (dayjs.utc as jest.Mock).mockImplementation((date?: string) => {
      return {
        isBefore: jest.fn().mockReturnValue(date === '2020-03-10'),
        set: jest.fn().mockReturnThis(),
        toDate: jest.fn().mockReturnValue(new Date(date || '2025-03-10')),
      };
    });

    await expect(
      createSessionUseCase.execute({ id: movieId, body: createSessionDto }),
    ).rejects.toThrow(
      new BadRequestException('Session date cannot be in the past'),
    );
  });

  it('should throw BadRequestException if session is already exists', async () => {
    const movieId = 'movie-uuid';
    const createSessionDto: CreateSessionDTO = {
      date: '2025-03-10',
      timeSlot: TIME_SLOTS['10:00'],
      roomNumber: 123,
    };

    sessionRepository.isSessionExists.mockResolvedValue(true);

    await expect(
      createSessionUseCase.execute({ id: movieId, body: createSessionDto }),
    ).rejects.toThrow(new BadRequestException('Session is already exists'));
  });
});
