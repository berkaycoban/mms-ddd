import { Watch } from '../entities/watch.entity';

export interface WatchRepository {
  create(watch: Watch): Promise<Watch>;
}
