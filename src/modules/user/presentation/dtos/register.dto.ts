import { Expose } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class RegisterDTO {
  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsNumber()
  @Min(1)
  @Max(99)
  age: number = 1;
}
