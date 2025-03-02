/* eslint-disable @typescript-eslint/no-require-imports */

import { type PrismaClient, UserRole } from '@prisma/client';

type User = {
  id: string;
  username: string;
  password: string;
  age: number;
  role: UserRole;
};

export async function seed(prisma: PrismaClient) {
  const startDate = new Date();
  console.log(
    `Started inserting/Updating users on ${startDate.toDateString()}`,
  );

  const users = require('./seed_sources/users.json') as unknown as User[];
  const totalCount = users?.length;
  let processedCount = 0;

  for (const { id, ...el } of users) {
    try {
      await prisma.user.upsert({
        where: { id },
        update: {
          id,
          username: el?.username,
          password: el?.password,
          age: el?.age,
          role: el?.role,
        },
        create: {
          id,
          username: el?.username,
          password: el?.password,
          age: el?.age,
          role: el?.role,
        },
      });
      processedCount++;
    } catch (e) {
      console.log(`Total user count: ${totalCount}`);
      console.log(`Inserted/updated user count: ${processedCount}`);
      console.log(`Exception occurred while processing user with id: ${id}>>`);
      throw e;
    }
  }

  console.log(`Total user count: ${totalCount}`);
  console.log(`Inserted/updated user count: ${processedCount}`);
  console.log(
    `Execution time in millis: ${new Date().getTime() - startDate.getTime()}`,
  );
}
