import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      return false;
    }

    return roles.includes(request.user.role);
  }
}
