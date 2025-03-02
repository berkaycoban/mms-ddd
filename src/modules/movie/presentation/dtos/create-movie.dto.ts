import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateSessionDTO } from './create-session.dto';

export class CreateMovieDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  ageRestriction: number;

  @Expose()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDTO)
  sessions: CreateSessionDTO[];
}
