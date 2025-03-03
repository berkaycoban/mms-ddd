import { Expose } from 'class-transformer';

export class BaseEntity<T> {
  @Expose()
  id: string;

  @Expose()
  createdAt?: Date | null;

  @Expose()
  updatedAt?: Date | null;

  constructor(props: BaseEntity<T>) {
    Object.assign(this, props);
  }
}
