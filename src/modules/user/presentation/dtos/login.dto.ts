import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginDTO {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;
}
