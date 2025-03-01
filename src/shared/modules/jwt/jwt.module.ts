import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NJwtModule } from '@nestjs/jwt';

import { JwtService } from './jwt.service';

const NestJwtModule = NJwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
  }),
});

@Global()
@Module({
  imports: [NestJwtModule],
  providers: [JwtService, ...(NestJwtModule.providers as Provider[])],
  exports: [JwtService, ...(NestJwtModule.providers as Provider[])],
})
export class JwtModule {}
