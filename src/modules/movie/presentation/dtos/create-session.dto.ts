import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { TIME_SLOTS } from '../../application/constants/time-slots';

export class CreateSessionDTO {
  @Expose()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Object.values(TIME_SLOTS), {
    message: `timeSlot must be one of the following values: ${Object.values(
      TIME_SLOTS,
    ).join(', ')}`,
  })
  timeSlot: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;
}
