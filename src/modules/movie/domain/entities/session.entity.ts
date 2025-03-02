import { Expose } from 'class-transformer';

import { ISession } from '../interfaces/session.interface';

export class Session implements ISession {
  @Expose()
  id: string;

  @Expose()
  date: Date;

  @Expose()
  roomNumber: number;

  @Expose()
  movieId: string;

  constructor(data: ISession) {
    Object.assign(this, data);
    this.validate();
  }

  private validate() {
    if (!this.date || !this.roomNumber || !this.movieId) {
      throw new Error('Invalid session!');
    }
  }
}
