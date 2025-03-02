export interface ISession {
  id: string;

  date: Date;
  timeSlot: string;
  roomNumber: number;

  movieId?: string;
}
