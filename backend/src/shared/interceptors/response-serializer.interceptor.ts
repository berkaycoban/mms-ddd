import {
  CallHandler,
  ClassSerializerInterceptor,
  ClassSerializerInterceptorOptions,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

import { UserRole } from '../types';

@Injectable()
export class ResponseSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const groups = this.getGroups(request);

    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
      strategy: 'excludeAll',
    } as ClassSerializerInterceptorOptions;

    if (groups?.length > 0) {
      options.groups = groups;
    }

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | PlainLiteralObject[]) =>
          this.serialize(res, options),
        ),
      );
  }

  private getGroups(request: Request): UserRole[] {
    const groups: UserRole[] = [];

    const user = request.user;
    if (!user) {
      return groups;
    }

    if (user.role === UserRole.CUSTOMER) {
      groups.push(UserRole.CUSTOMER);
    }

    if (user.role === UserRole.MANAGER) {
      groups.push(UserRole.MANAGER);
    }

    return groups;
  }
}
