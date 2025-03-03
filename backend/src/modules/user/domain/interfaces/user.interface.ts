import { UserRole } from '@/shared/types';

export interface IUser {
  id: string;
  username: string;
  password: string;
  age: number;
  role: UserRole;
}
