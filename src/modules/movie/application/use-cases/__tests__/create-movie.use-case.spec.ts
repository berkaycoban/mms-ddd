import { Test, TestingModule } from '@nestjs/testing';

import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepository } from '../../../domain/repositories/movie.repository';
import { CreateMovieDTO } from '../../../presentation/dtos/create-movie.dto';
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
    };

    const expectedMovie = new Movie({
      id: 'movie-uuid',
      name: 'Inception',
      ageRestriction: 13,
    });

    movieRepository.create.mockResolvedValue(expectedMovie);

    const result = await createMovieUseCase.execute(createMovieDto);

    expect(result).toEqual(expectedMovie);
  });

  it('should throw BadRequestException if no valid sessions are provided', async () => {
    const createMovieDto: CreateMovieDTO = {
      name: '',
      ageRestriction: 18,
    };

    await expect(createMovieUseCase.execute(createMovieDto)).rejects.toThrow(
      new Error('Invalid movie'),
    );
  });
});
