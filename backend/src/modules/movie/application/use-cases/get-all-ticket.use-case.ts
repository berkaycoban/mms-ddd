import { Inject, Injectable, Logger } from '@nestjs/common';

import { IGetUser, UserRole } from '@/shared/types';

import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { GetAllTicketQueryDTO } from '../../presentation/dtos/get-all-ticket-query.dto';
import { GetAllTicketResponse } from '../../presentation/dtos/get-all-ticket.response.dto';

@Injectable()
export class GetAllTicketUseCase {
  private readonly logger = new Logger(GetAllTicketUseCase.name);

  constructor(
    @Inject('TicketRepository')
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute({
    user,
    query,
  }: {
    user: IGetUser;
    query: GetAllTicketQueryDTO;
  }): Promise<GetAllTicketResponse> {
    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const userId =
      user.role === UserRole.MANAGER ? query?.userId || undefined : user.id;

    const filter = {
      userId,
    };

    const { totalCount, items } = await this.ticketRepository.getAll({
      pagination,
      orderBy: query.orderBy,
      filter,
    });

    return new GetAllTicketResponse({
      totalCount,
      items,
    });
  }
}
