import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { UserRole } from '@/shared/types';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
        age: user.age,
        role: user.role,
      },
    });

    return new User({ ...createdUser, role: createdUser.role as UserRole });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User({ ...user, role: user.role as UserRole });
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return new User({ ...user, role: user.role as UserRole });
  }
}
