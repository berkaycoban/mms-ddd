import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const GetId = createParamDecorator(
  (key: string, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const paramKey = key ? key : 'id';
    const id = request?.params?.[paramKey] || null;

    if (!id) {
      throw new ForbiddenException('Invalid ID');
    }

    // UUID v4 check
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    if (!uuidRegex.test(id)) {
      throw new ForbiddenException('Invalid ID');
    }

    return id;
  },
);
