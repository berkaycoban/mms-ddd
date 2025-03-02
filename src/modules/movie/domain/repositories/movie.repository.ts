import { BasePagination } from '@/shared/types';

import { Movie } from '../entities/movie.entity';

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;
  getAll({
    pagination,
  }: {
    pagination: BasePagination;
  }): Promise<{ totalCount: number; items: Movie[] }>;
  getAllAvailableMovies({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: { startDate: string; endDate: string };
  }): Promise<{ totalCount: number; items: Movie[] }>;
  getById(id: string): Promise<Movie | null>;
  updateById(id: string, movie: Movie): Promise<Movie>;
  deleteById(id: string): Promise<void>;
}
