import { Expose } from 'class-transformer';

import { Movie } from './movie.entity';
import { Session } from './session.entity';
import { IWatch } from '../interfaces/watch.interface';

export class Watch implements IWatch {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  ticketId: string;

  @Expose()
  sessionId: string;

  @Expose()
  movieId: string;

  @Expose()
  movie?: Movie;

  @Expose()
  session?: Session;

  constructor(data: IWatch) {
    Object.assign(this, data);
  }
}
