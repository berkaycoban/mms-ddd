import { Expose } from 'class-transformer';

import { BaseEntity } from '@/shared/entities/base.entity';

import { ISession } from '../interfaces/session.interface';

export class Session extends BaseEntity<ISession> {
  @Expose()
  date: Date;

  @Expose()
  roomNumber: number;

  @Expose()
  movieId: string;

  constructor(data: Omit<Session, 'validate'>) {
    super(data);
    Object.assign(this, data);
    this.validate();
  }

  private validate() {
    if (!this.date || !this.roomNumber || !this.movieId) {
      throw new Error('Invalid session!');
    }
  }
}
