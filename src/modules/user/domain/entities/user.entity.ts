import { Expose } from 'class-transformer';

import { UserRole } from '@/shared/types';

import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  password: string; // hashed password

  @Expose()
  age: number;

  @Expose()
  role: UserRole;

  constructor(data: Omit<User, 'validate'>) {
    Object.assign(this, data);
    this.validate();
  }

  private validate() {
    if (!this.username || !this.password) {
      throw new Error('Invalid user');
    }

    if (this.age < 0 || this.age > 99) {
      throw new Error('Invalid age');
    }

    if (!Object.values(UserRole).includes(this.role)) {
      throw new Error('Invalid role');
    }
  }
}
