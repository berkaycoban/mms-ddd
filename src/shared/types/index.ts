export enum UserRole {
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

export interface BasePagination {
  page: number;
  limit: number;
}
