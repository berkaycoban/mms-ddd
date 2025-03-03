import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { UserRole } from '@/shared/types';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  signToken(payload: { id: string; role: UserRole }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): { id: string; role: UserRole } {
    return this.jwtService.verify(token);
  }
}
