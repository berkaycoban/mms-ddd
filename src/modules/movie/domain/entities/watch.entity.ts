import { Expose } from 'class-transformer';

import { BaseEntity } from '@/shared/entities/base.entity';

import { Movie } from './movie.entity';
import { Session } from './session.entity';
import { IWatch } from '../interfaces/watch.interface';

export class Watch extends BaseEntity<IWatch> {
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

  constructor(data: Watch) {
    super(data);
    Object.assign(this, data);
  }
}
