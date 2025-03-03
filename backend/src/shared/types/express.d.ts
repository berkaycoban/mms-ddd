import { UserDTO } from '@/modules/user/presentation/dtos/user.dto';

declare global {
  namespace Express {
    export interface Request {
      user: UserDTO;
    }
  }
}
