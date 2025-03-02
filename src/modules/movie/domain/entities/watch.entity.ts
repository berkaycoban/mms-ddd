import { Expose } from 'class-transformer';

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

  constructor(data: IWatch) {
    Object.assign(this, data);
  }
}
