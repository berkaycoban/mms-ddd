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

  private getGroups(): any[] {
    const groups: any[] = [];

    // TODO: Implement role based validation
    // const user = this.request.user;

    return groups;
  }
}
