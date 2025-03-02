import { Movie } from '../entities/movie.entity';

export interface MovieRepository {
  create(movie: Movie): Promise<Movie>;

  isSessionTaken(data: {
    date: Date;
    timeSlot: string;
    roomNumber: number;
  }): Promise<boolean>;

  deleteById(id: string): Promise<void>;
}
