/* eslint-disable @typescript-eslint/no-require-imports */

import { TicketStatus, type PrismaClient } from '@prisma/client';

type Ticket = {
  id: string;
  sessionId: string;
  userId: string;
  status: TicketStatus;
};

export async function seed(prisma: PrismaClient) {
  const startDate = new Date();
  console.log(
    `Started inserting/Updating tickets on ${startDate.toDateString()}`,
  );

  const tickets = require('./seed_sources/tickets.json') as unknown as Ticket[];
  const totalCount = tickets?.length;

  let processedCount = 0;

  for (const { id, ...el } of tickets) {
    try {
      await prisma.ticket.upsert({
        where: { id },
        update: {
          id,
          sessionId: el?.sessionId,
          userId: el?.userId,
          status: el?.status,
        },
        create: {
          id,
          sessionId: el?.sessionId,
          userId: el?.userId,
          status: el?.status,
        },
      });
      processedCount++;
    } catch (e) {
      console.log(`Total ticket count: ${totalCount}`);
      console.log(`Inserted/updated ticket count: ${processedCount}`);
      console.log(
        `Exception occurred while processing ticket with id: ${id}>>`,
      );
      throw e;
    }
  }

  console.log(`Total ticket count: ${totalCount}`);
  console.log(`Inserted/updated ticket count: ${processedCount}`);
  console.log(
    `Execution time in millis: ${new Date().getTime() - startDate.getTime()}`,
  );
}
