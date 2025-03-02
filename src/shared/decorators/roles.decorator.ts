import { Reflector } from '@nestjs/core';

import { UserRole } from '@/shared/types';

export const Roles = Reflector.createDecorator<UserRole[]>();
