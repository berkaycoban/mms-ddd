import { Expose } from 'class-transformer';

export class UpdateMovieResponseDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  ageRestriction: number;

  constructor(data: UpdateMovieResponseDTO) {
    Object.assign(this, data);
  }
}
