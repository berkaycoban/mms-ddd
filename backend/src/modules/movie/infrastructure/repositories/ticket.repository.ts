import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

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
