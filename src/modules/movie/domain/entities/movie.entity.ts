import { Expose } from 'class-transformer';

import { BaseEntity } from '@/shared/entities/base.entity';

import { Session } from './session.entity';
import { IMovie } from '../interfaces/movie.interface';

export class Movie extends BaseEntity<IMovie> {
  @Expose()
  name: string;

  @Expose()
  ageRestriction: number;

  @Expose()
  sessions?: Session[];

  constructor(data: Omit<Movie, 'validate'>) {
    super(data);
    Object.assign(this, data);
    this.validate();
  }

  private validate() {
    if (!this.name || !this.ageRestriction) {
      throw new Error('Invalid movie');
    }

    if (this.ageRestriction < 0 || this.ageRestriction > 24) {
      throw new Error('Invalid age restriction');
    }
  }
}
