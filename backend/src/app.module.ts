import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { loadConfig } from './config/env';
import { MovieModule } from './modules/movie/movie.module';
import { UserModule } from './modules/user/user.module';
import { AllExceptionFilter } from './shared/filters/all-exception.filter';
import { BadRequestExceptionFilter } from './shared/filters/bad-request.exception.filter';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { ResponseSerializerInterceptor } from './shared/interceptors/response-serializer.interceptor';
import { JwtModule } from './shared/modules/jwt/jwt.module';
import { LoggerModule } from './shared/modules/logger/logger.module';
import { PrismaClientException } from './shared/modules/prisma/prisma-exception.filter';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { CustomValidationPipe } from './shared/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
    }),
    LoggerModule,
    JwtModule,
    PrismaModule,

    UserModule,
    MovieModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_PIPE, useClass: CustomValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaClientException },
    { provide: APP_INTERCEPTOR, useClass: ResponseSerializerInterceptor },
  ],
})
export class AppModule {}
