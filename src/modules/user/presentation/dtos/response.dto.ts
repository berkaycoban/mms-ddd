import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserDTO } from './user.dto';

export class ResponseDTO {
  constructor(data: { token: string; user: UserDTO }) {
    this.token = data.token;
    this.user = data.user;
  }

  @Expose()
  token: string;

  @Expose()
  @ValidateNested()
  @Type(() => UserDTO)
  user: UserDTO;
}
