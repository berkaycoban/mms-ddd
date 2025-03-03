import { Expose } from 'class-transformer';

export class BaseEntity<T> {
  @Expose()
  id: string;

  @Expose()
  createdAt?: Date | string | null;

  @Expose()
  updatedAt?: Date | string | null;

  constructor(props: BaseEntity<T>) {
    Object.assign(this, props);
  }
}
