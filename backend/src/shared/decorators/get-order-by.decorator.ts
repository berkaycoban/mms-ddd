import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetOrderBy = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const sortBy: string = (request?.query.sortBy as string) || '-updatedAt';
    const sortByList = sortBy.split(',');

    const orderBy = {} as Record<string, 'asc' | 'desc'>;

    for (const sortBy of sortByList) {
      if (sortBy.slice(0, 1) === '-') orderBy[sortBy.slice(1)] = 'desc';
      else orderBy[sortBy] = 'asc';
    }

    return orderBy;
  },
);
