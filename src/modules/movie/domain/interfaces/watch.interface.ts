import { Movie } from '../entities/movie.entity';
import { Session } from '../entities/session.entity';

export interface IWatch {
  id: string;

  userId: string;
  ticketId: string;

  sessionId: string;
  session?: Session;

  movieId: string;
  movie?: Movie;
}
