import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Movie } from '../../../domain/entities/movie.entity';
import { Session } from '../../../domain/entities/session.entity';
import { MovieRepository } from '../../../domain/repositories/movie.repository';
import { CreateMovieDTO } from '../../../presentation/dtos/create-movie.dto';
import { TIME_SLOTS } from '../../constants/time-slots';
import { CreateMovieUseCase } from '../create-movie.use-case';

describe('CreateMovieUseCase', () => {
  let createMovieUseCase: CreateMovieUseCase;
  let movieRepository: jest.Mocked<MovieRepository>;

  beforeEach(async () => {
    const mockMovieRepository = {
      create: jest.fn(),
      isSessionTaken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMovieUseCase,
        { provide: 'MovieRepository', useValue: mockMovieRepository },
      ],
    }).compile();

    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    movieRepository = module.get('MovieRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a movie successfully with valid sessions', async () => {
    const createMovieDto: CreateMovieDTO = {
      name: 'Inception',
      ageRestriction: 13,
      sessions: [
        {
          date: new Date('2025-03-10'),
          timeSlot: TIME_SLOTS['10:00-12:00'],
          roomNumber: 123,
        },
      ],
    };

    const expectedMovie = new Movie({
      id: 'movie-uuid',
      name: 'Inception',
      ageRestriction: 13,
      sessions: [
        new Session({
          id: 'session-uuid',
          date: new Date('2025-03-10'),
          timeSlot: TIME_SLOTS['10:00-12:00'],
          roomNumber: 123,
        }),
      ],
    });

    movieRepository.isSessionTaken.mockResolvedValue(false);
    movieRepository.create.mockResolvedValue(expectedMovie);

    const result = await createMovieUseCase.execute(createMovieDto);

    expect(result).toEqual({ movie: expectedMovie, errors: [] });
  });

  it('should return movie with errors for taken sessions', async () => {
    const createMovieDto: CreateMovieDTO = {
      name: 'Interstellar',
      ageRestriction: 15,
      sessions: [
        {
          date: new Date('2025-03-10'),
          timeSlot: TIME_SLOTS['10:00-12:00'],
          roomNumber: 123,
        },
        {
          date: new Date('2025-03-10'),
          timeSlot: TIME_SLOTS['12:00-14:00'],
          roomNumber: 124,
        },
      ],
    };

    const expectedMovie = new Movie({
      id: 'movie-uuid',
      name: 'Interstellar',
      ageRestriction: 15,
      sessions: [
        new Session({
          id: 'session-uuid',
          date: new Date('2025-03-10'),
          timeSlot: TIME_SLOTS['12:00-14:00'],
          roomNumber: 124,
        }),
      ],
    });

    movieRepository.isSessionTaken
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    movieRepository.create.mockResolvedValue(expectedMovie);

    const result = await createMovieUseCase.execute(createMovieDto);

    expect(result).toEqual({
      movie: expectedMovie,
      errors: [
        `Session at ${new Date('2025-03-10').toISOString()}, ${TIME_SLOTS['10:00-12:00']} in room 123 is already taken`,
      ],
    });
  });

  it('should throw BadRequestException if no valid sessions are provided', async () => {
    const createMovieDto: CreateMovieDTO = {
      name: 'The Matrix',
      ageRestriction: 18,
      sessions: [
        {
          date: new Date('2025-03-02'),
          timeSlot: TIME_SLOTS['10:00-12:00'],
          roomNumber: 123,
        },
      ],
    };

    movieRepository.isSessionTaken.mockResolvedValue(true);

    await expect(createMovieUseCase.execute(createMovieDto)).rejects.toThrow(
      new BadRequestException('No valid sessions provided!'),
    );
  });

  it('should return errors for past sessions', async () => {
    const createMovieDto: CreateMovieDTO = {
      name: 'The Matrix',
      ageRestriction: 18,
      sessions: [
        {
          date: new Date('2020-03-02'),
          timeSlot: TIME_SLOTS['10:00-12:00'],
          roomNumber: 123,
        },
      ],
    };

    movieRepository.isSessionTaken.mockResolvedValue(true);

    await expect(createMovieUseCase.execute(createMovieDto)).rejects.toThrow(
      new BadRequestException(`No valid sessions provided!`),
    );
  });
});
