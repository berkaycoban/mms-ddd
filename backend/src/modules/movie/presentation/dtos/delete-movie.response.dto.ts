import { Expose } from 'class-transformer';

export class DeleteMovieResponseDto {
  @Expose()
  message: string;

  constructor(data: DeleteMovieResponseDto) {
    Object.assign(this, data);
  }
}
