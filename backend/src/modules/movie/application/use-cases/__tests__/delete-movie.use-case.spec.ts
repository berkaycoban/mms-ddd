import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { MovieNotFoundException } from '../../../domain/exceptions/movie-not-found.exception';
import { MovieRepository } from '../../../domain/repositories/movie.repository';
import { DeleteMovieResponseDto } from '../../../presentation/dtos/delete-movie.response.dto';
import { DeleteMovieUseCase } from '../delete-movie.use-case';

describe('DeleteMovieUseCase', () => {
  let deleteMovieUseCase: DeleteMovieUseCase;
  let movieRepository: jest.Mocked<MovieRepository>;

  beforeEach(async () => {
    const mockMovieRepository = {
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMovieUseCase,
        { provide: 'MovieRepository', useValue: mockMovieRepository },
      ],
    }).compile();

    deleteMovieUseCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
    movieRepository = module.get('MovieRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a movie successfully and return response', async () => {
    const movieId = 'movie-uuid';

    const expectedResponse = new DeleteMovieResponseDto({
      message: 'Movie deleted successfully',
    });

    movieRepository.deleteById.mockResolvedValue(undefined);

    const result = await deleteMovieUseCase.execute({
      id: movieId,
    });

    expect(result).toEqual(expectedResponse);
  });

  it('should throw NotFoundException if movie does not exist', async () => {
    const movieId = 'non-existent-uuid';

    movieRepository.deleteById.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'x',
      }),
    );

    await expect(deleteMovieUseCase.execute({ id: movieId })).rejects.toThrow(
      new MovieNotFoundException(movieId),
    );
  });
});
