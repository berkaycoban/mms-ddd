import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../../domain/interfaces/user.repository';
import { UserDTO } from '../../presentation/dtos/user.dto';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return new UserDTO(user);
  }
}
