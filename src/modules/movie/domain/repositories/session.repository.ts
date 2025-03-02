import { BasePagination } from '@/shared/types';

import { Session } from '../entities/session.entity';

export interface SessionRepository {
  create(session: Session): Promise<Session>;
  isSessionExists(data: { date: Date; roomNumber: number }): Promise<boolean>;

  getAll({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: {
      movieId: string;
      roomNumber?: number;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<{ totalCount: number; items: Session[] }>;

  getById(id: string): Promise<Session | null>;
}
