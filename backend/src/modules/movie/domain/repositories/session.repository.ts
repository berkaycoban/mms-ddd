import { BasePagination, IOrderBy } from '@/shared/types';

import { Session } from '../entities/session.entity';

export interface SessionRepository {
  create(session: Session): Promise<Session>;
  isSessionExists(data: { date: Date; roomNumber: number }): Promise<boolean>;

  getAll({
    pagination,
    filter,
    orderBy,
  }: {
    pagination: BasePagination;
    filter: {
      movieId: string;
      roomNumber?: number;
      startDate?: string;
      endDate?: string;
    };
    orderBy: IOrderBy;
  }): Promise<{ totalCount: number; items: Session[] }>;

  getById(id: string): Promise<Session | null>;
}
