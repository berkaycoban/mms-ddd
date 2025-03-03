import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { BasePagination, IOrderBy } from '@/shared/types';

import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';

@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ticket: Ticket) {
    const createdTicket = await this.prisma.ticket.create({
      data: {
        sessionId: ticket.sessionId,
        userId: ticket.userId,
      },
    });

    return new Ticket(createdTicket);
  }

  async isTicketExists({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { sessionId, userId },
    });

    return !!ticket;
  }

  async getAll({
    pagination,
    orderBy,
    filter,
  }: {
    pagination: BasePagination;
    orderBy: IOrderBy;
    filter: { userId?: string };
  }): Promise<{ totalCount: number; items: Ticket[] }> {
    const whereQuery: Prisma.TicketWhereInput = {};

    if (filter.userId) {
      whereQuery.userId = filter.userId;
    }

    const [totalCount, tickets] = await Promise.all([
      this.prisma.ticket.count({ where: whereQuery }),
      this.prisma.ticket.findMany({
        where: whereQuery,
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
        orderBy,
      }),
    ]);

    const items: Ticket[] = [];

    for (const ticket of tickets) {
      items.push(new Ticket({ ...ticket }));
    }

    return { items, totalCount };
  }

  async getById(ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return null;
    }

    return new Ticket(ticket);
  }

  async update(ticket: Ticket): Promise<void> {
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: ticket,
    });
  }
}
