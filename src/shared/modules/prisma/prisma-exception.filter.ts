import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientException extends BaseExceptionFilter {
  private errorCodesStatusMapping: Record<string, number> = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2003: HttpStatus.UNPROCESSABLE_ENTITY,
    P2025: HttpStatus.NOT_FOUND,
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message =
      `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    return super.catch(
      new HttpException({ statusCode, message }, statusCode),
      host,
    );
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
