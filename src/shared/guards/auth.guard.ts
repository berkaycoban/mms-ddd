import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case';
import { IS_PUBLIC_KEY } from '@/shared/decorators/auth.decorator';
import { JwtService } from '@/shared/modules/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this._extractTokenFromHeader(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verifyToken(token);

      if (!payload || !payload.id || !payload.role) {
        throw new UnauthorizedException();
      }

      const user = await this.getUserByIdUseCase.execute(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      request.user = user;
      return true;
    } catch {
      if (isPublic) {
        return true;
      }

      throw new UnauthorizedException();
    }
  }

  private _extractTokenFromHeader(request: Request): string {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
