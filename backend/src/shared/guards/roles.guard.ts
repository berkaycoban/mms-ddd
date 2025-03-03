import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UserRole } from '@/shared/types';

import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
    if (!roles || Object.keys(roles).length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException('Forbidden');
    }

    const hasRole = roles.includes(request.user.role);
    if (!hasRole) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
