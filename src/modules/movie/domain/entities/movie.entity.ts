import { Expose } from 'class-transformer';

import { Session } from './session.entity';
import { IMovie } from '../interfaces/movie.interface';

export class Movie implements IMovie {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  ageRestriction: number;

  @Expose()
  sessions?: Session[];

  constructor(data: Omit<Movie, 'validate'>) {
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
