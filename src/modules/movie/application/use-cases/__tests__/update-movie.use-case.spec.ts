import { Test, TestingModule } from '@nestjs/testing';

import { Movie } from '../../../domain/entities/movie.entity';
import { MovieNotFoundException } from '../../../domain/exceptions/movie-not-found.exception';
import { MovieRepository } from '../../../domain/repositories/movie.repository';
import { UpdateMovieDTO } from '../../../presentation/dtos/update-movie.dto';
import { UpdateMovieResponseDTO } from '../../../presentation/dtos/update-movie.response.dto';
import { UpdateMovieUseCase } from '../update-movie.use-case';

describe('UpdateMovieUseCase', () => {
  let updateMovieUseCase: UpdateMovieUseCase;
  let movieRepository: jest.Mocked<MovieRepository>;

  beforeEach(async () => {
    const mockMovieRepository = {
      getById: jest.fn(),
      updateById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMovieUseCase,
        { provide: 'MovieRepository', useValue: mockMovieRepository },
      ],
    }).compile();

    updateMovieUseCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
    movieRepository = module.get('MovieRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a movie successfully and return response', async () => {
    const movieId = 'movie-uuid';
    const updateMovieDto: UpdateMovieDTO = {
      name: 'Inception Updated',
      ageRestriction: 15,
    };
    const existingMovie = new Movie({
      id: movieId,
      name: 'Inception',
      ageRestriction: 13,
      sessions: [],
    });

    const updatedMovie = new Movie({
      id: movieId,
      name: 'Inception Updated',
      ageRestriction: 15,
      sessions: [],
    });

    const expectedResponse = new UpdateMovieResponseDTO(updatedMovie);

    movieRepository.getById.mockResolvedValue(existingMovie);
    movieRepository.updateById.mockResolvedValue(updatedMovie);

    const result = await updateMovieUseCase.execute({
      id: movieId,
      body: updateMovieDto,
    });

    expect(result).toEqual(expectedResponse);
  });

  it('should throw MovieNotFoundException if movie does not exist', async () => {
    const movieId = 'non-existent-uuid';

    const updateMovieDto: UpdateMovieDTO = {
      name: 'Inception Updated',
      ageRestriction: 15,
    };

    movieRepository.getById.mockResolvedValue(null);

    await expect(
      updateMovieUseCase.execute({ id: movieId, body: updateMovieDto }),
    ).rejects.toThrow(new MovieNotFoundException(movieId));
  });
});
