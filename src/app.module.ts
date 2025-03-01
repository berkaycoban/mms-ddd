import { Module } from '@nestjs/common';

import { LoggerModule } from './shared/modules/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
