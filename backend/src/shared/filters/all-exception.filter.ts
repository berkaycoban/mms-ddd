import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private _logger = new Logger('AllExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (exception['message'] as unknown as string) || 'Something went wrong';

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

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
