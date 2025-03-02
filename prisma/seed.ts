import { PrismaClient } from '@prisma/client';

import * as MovieSessions from './seed.movie-sessions';
import * as Movies from './seed.movies';
import * as Tickets from './seed.tickets';
import * as Users from './seed.users';

const prisma = new PrismaClient();

async function main() {
  await Users.seed(prisma);
  await Movies.seed(prisma);
  await MovieSessions.seed(prisma);
  await Tickets.seed(prisma);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
