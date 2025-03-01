import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@/shared/modules/jwt/jwt.service';

import { UserRepository } from '../../domain/interfaces/user.repository';
import { PasswordService } from '../../infrastructure/services/password.service';
import { LoginDTO } from '../../presentation/dtos/login.dto';
import { ResponseDTO } from '../../presentation/dtos/response.dto';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: LoginDTO): Promise<{ token: string }> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) {
      this.logger.error(`User with username ${dto.username} not found`);
      throw new ForbiddenException('Invalid credentials!');
    }

    const isPasswordValid = await this.passwordService.validate(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.error(
        `Invalid password for user with username ${dto.username}`,
      );
      throw new ForbiddenException('Invalid credentials!');
    }

    const token = this.jwtService.signToken({ id: user.id, role: user.role });

    return new ResponseDTO({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        age: user.age,
      },
    });
  }
}
