import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundException extends NotFoundException {
  constructor(movieId: string) {
    super({
      statusCode: 404,
      message: `Movie with id ${movieId} not found`,
      error: 'Not Found',
    });
  }
}
