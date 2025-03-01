import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { loadConfig } from './config/env';
import { AllExceptionFilter } from './shared/filters/all-exception.filter';
import { BadRequestExceptionFilter } from './shared/filters/bad-request.exception.filter';
import { ResponseSerializerInterceptor } from './shared/interceptors/response-serializer.interceptor';
import { LoggerModule } from './shared/modules/logger/logger.module';
import { CustomValidationPipe } from './shared/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useClass: CustomValidationPipe },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseSerializerInterceptor },
  ],
})
export class AppModule {}
