import {
  ArgumentMetadata,
  Injectable,
  Inject,
  PipeTransform,
  ValidationPipe,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';
import { Request } from 'express';

import { UserRole } from '../types';

@Injectable({ scope: Scope.REQUEST })
export class CustomValidationPipe implements PipeTransform {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype, type } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const transformOptions: ClassTransformOptions = {
      enableImplicitConversion: false,
      exposeDefaultValues: true,
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    };

    if (type === 'param' || type === 'query') {
      transformOptions.enableImplicitConversion = true;
    }

    const groups = this.getGroups();
    if (groups.length > 0) {
      transformOptions.groups = groups;
    }

    const validationPipe = new ValidationPipe({
      transform: true,
      whitelist: false,
      transformOptions,
    });

    return await validationPipe.transform(value, metadata);
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return !types.includes(metatype);
  }

  private getGroups(): UserRole[] {
    const groups: UserRole[] = [];

    const user = this.request.user;

    if (!user) {
      return groups;
    }

    if (user.role === UserRole.CUSTOMER) {
      groups.push(UserRole.CUSTOMER);
    }

    if (user.role === UserRole.MANAGER) {
      groups.push(UserRole.MANAGER);
    }

    return groups;
  }
}
