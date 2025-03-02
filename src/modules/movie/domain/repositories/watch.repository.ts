import { BasePagination } from '@/shared/types';

import { Watch } from '../entities/watch.entity';

export interface WatchRepository {
  create(watch: Watch): Promise<Watch>;
  getAll({
    pagination,
    filter,
  }: {
    pagination: BasePagination;
    filter: { userId: string };
  }): Promise<{ totalCount: number; items: Watch[] }>;
}
