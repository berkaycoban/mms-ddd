/* eslint-disable @typescript-eslint/no-require-imports */

import { type PrismaClient } from '@prisma/client';

type Movie = {
  id: string;
  name: string;
  ageRestriction: number;
};

export async function seed(prisma: PrismaClient) {
  const startDate = new Date();
  console.log(
    `Started inserting/Updating movies on ${startDate.toDateString()}`,
  );

  const movies = require('./seed_sources/movies.json') as unknown as Movie[];
  const totalCount = movies?.length;

  let processedCount = 0;

  for (const { id, ...el } of movies) {
    try {
      await prisma.movie.upsert({
        where: { id },
        update: {
          id,
          name: el?.name,
          ageRestriction: el?.ageRestriction,
        },
        create: {
          id,
          name: el?.name,
          ageRestriction: el?.ageRestriction,
        },
      });
      processedCount++;
    } catch (e) {
      console.log(`Total movie count: ${totalCount}`);
      console.log(`Inserted/updated movie count: ${processedCount}`);
      console.log(`Exception occurred while processing movie with id: ${id}>>`);
      throw e;
    }
  }

  console.log(`Total movie count: ${totalCount}`);
  console.log(`Inserted/updated movie count: ${processedCount}`);
  console.log(
    `Execution time in millis: ${new Date().getTime() - startDate.getTime()}`,
  );
}
