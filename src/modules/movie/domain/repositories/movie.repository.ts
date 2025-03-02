import { Movie } from '../entities/movie.entity';

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;

  isSessionTaken(data: {
    date: Date;
    timeSlot: string;
    roomNumber: number;
  }): Promise<boolean>;

  getById(id: string): Promise<Movie | null>;
  updateById(id: string, movie: Movie): Promise<Movie>;
  deleteById(id: string): Promise<void>;
}
