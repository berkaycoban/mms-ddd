import { Session } from '../entities/session.entity';

export interface IMovie {
  id: string;
  name: string;
  ageRestriction: number;

  sessions?: Session[];
}
