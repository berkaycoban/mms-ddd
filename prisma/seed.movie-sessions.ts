/* eslint-disable @typescript-eslint/no-require-imports */

import { type PrismaClient } from '@prisma/client';

type MovieSession = {
  id: string;
  movieId: string;
  roomNumber: number;
  date: Date;
};

export async function seed(prisma: PrismaClient) {
  const startDate = new Date();
  console.log(
    `Started inserting/Updating movie sessions on ${startDate.toDateString()}`,
  );

  const movieSessions =
    require('./seed_sources/movie-sessions.json') as unknown as MovieSession[];
  const totalCount = movieSessions?.length;

  let processedCount = 0;

  for (const { id, ...el } of movieSessions) {
    try {
      await prisma.session.upsert({
        where: { id },
        update: {
          id,
          movieId: el?.movieId,
          roomNumber: el?.roomNumber,
          date: el?.date,
        },
        create: {
          id,
          movieId: el?.movieId,
          roomNumber: el?.roomNumber,
          date: el?.date,
        },
      });
      processedCount++;
    } catch (e) {
      console.log(`Total movie session count: ${totalCount}`);
      console.log(`Inserted/updated movie session count: ${processedCount}`);
      console.log(
        `Exception occurred while processing movie session with id: ${id}>>`,
      );
      throw e;
    }
  }

  console.log(`Total movie session count: ${totalCount}`);
  console.log(`Inserted/updated movie session count: ${processedCount}`);
  console.log(
    `Execution time in millis: ${new Date().getTime() - startDate.getTime()}`,
  );
}
