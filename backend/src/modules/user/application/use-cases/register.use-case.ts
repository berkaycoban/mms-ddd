import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@/shared/modules/jwt/jwt.service';
import { UserRole } from '@/shared/types';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user.repository';
import { PasswordService } from '../../infrastructure/services/password.service';
import { RegisterDTO } from '../../presentation/dtos/register.dto';
import { ResponseDTO } from '../../presentation/dtos/response.dto';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(dto: RegisterDTO): Promise<{ token: string }> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      this.logger.error(`User with username ${dto.username} already exists`);
      throw new ForbiddenException(
        'Registration could not be completed. Please try a different username.',
      );
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = new User({
      id: '',
      username: dto.username,
      password: hashedPassword,
      age: dto.age,
      role: UserRole.CUSTOMER,
    });

    const createdUser = await this.userRepository.create(user);

    const token = this.jwtService.signToken({ id: user.id, role: user.role });

    return new ResponseDTO({
      token,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        role: createdUser.role,
        age: createdUser.age,
      },
    });
  }
}
