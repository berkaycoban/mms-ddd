import { Expose } from 'class-transformer';

import { UserRole } from '@/shared/types';

export class UserDTO {
  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  role: UserRole;

  @Expose()
  age: number;
}
