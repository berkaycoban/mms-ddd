import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private _logger = new Logger('BadRequestExceptionFilter');

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const exceptionStatus = exception.getStatus();

    const message =
      (exceptionResponse as { message?: string })?.message ||
      'Something went wrong';
    const statusCode = exceptionStatus || HttpStatus.INTERNAL_SERVER_ERROR;

    const jsonBody = {
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this._logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(jsonBody),
    );

    response.status(statusCode).json(jsonBody);
  }
}
