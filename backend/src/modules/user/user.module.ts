import { Module } from '@nestjs/common';

import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository';
import { PasswordService } from './infrastructure/services/password.service';
import { AuthController } from './presentation/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    PasswordService,
    LoginUseCase,
    RegisterUseCase,
    GetUserByIdUseCase,
  ],
  exports: [GetUserByIdUseCase],
})
export class UserModule {}
