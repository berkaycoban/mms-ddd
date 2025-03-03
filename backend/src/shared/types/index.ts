import { UserDTO } from '@/modules/user/presentation/dtos/user.dto';

export enum UserRole {
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

export type IGetUser = UserDTO;
export type IOrderBy = Record<string, 'asc' | 'desc'>;

export interface BasePagination {
  page: number;
  limit: number;
}
