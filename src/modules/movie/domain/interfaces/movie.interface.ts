import { ISession } from './session.interface';

export interface IMovie {
  id: string;
  name: string;
  ageRestriction: number;
  sessions: ISession[];
}
