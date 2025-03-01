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

  private getGroups(request: Request): any[] {
    const groups: any[] = [];

    // TODO: Implement role based serialization
    // const user = request.user;

    return groups;
  }
}
