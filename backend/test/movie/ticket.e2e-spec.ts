import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import * as request from 'supertest';

import { BuyTicketUseCase } from '@/modules/movie/application/use-cases/buy-ticket.use-case';
import { GetAllTicketUseCase } from '@/modules/movie/application/use-cases/get-all-ticket.use-case';
import { Ticket } from '@/modules/movie/domain/entities/ticket.entity';
import { TicketStatus } from '@/modules/movie/domain/interfaces/ticket.interface';
import { BuyTicketDTO } from '@/modules/movie/presentation/dtos/buy-ticket.dto';
import { TicketController } from '@/modules/movie/presentation/ticket.controller';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { IGetUser, UserRole } from '@/shared/types';

describe('TicketController (e2e)', () => {
  let app: INestApplication;

  let buyTicketUseCase: jest.Mocked<BuyTicketUseCase>;
  let getAllTicketUseCase: jest.Mocked<GetAllTicketUseCase>;

  beforeAll(async () => {
    const mockBuyTicketUseCase = { execute: jest.fn() };
    const mockGetAllTicketUseCase = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        Reflector,
        { provide: BuyTicketUseCase, useValue: mockBuyTicketUseCase },
        { provide: GetAllTicketUseCase, useValue: mockGetAllTicketUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req: Request = context.switchToHttp().getRequest();
          req.user = JSON.parse(
            (req.headers['user'] as string) || '{}',
          ) as IGetUser;

          if (!req.user) {
            return false;
          }

          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const reflector = app.get(Reflector);
          const req: Request = context.switchToHttp().getRequest();

          const roles =
            reflector.get<UserRole[]>('roles', context.getHandler()) || [];
          if (!roles.length) return true;

          if (!req.user || !req.user.role) {
            return false;
          }

          const hasRole = roles.includes(req.user.role);
          if (!hasRole) {
            return false;
          }

          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    buyTicketUseCase = moduleFixture.get(BuyTicketUseCase);
    getAllTicketUseCase = moduleFixture.get(GetAllTicketUseCase);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /tickets', () => {
    it('should buy a ticket successfully', async () => {
      const buyTicketDto: BuyTicketDTO = {
        sessionId: 'session-uuid',
      };

      const mockResponse = new Ticket({
        id: 'ticket-uuid',
        userId: 'user-id',
        sessionId: 'session-uuid',
        status: TicketStatus.ACTIVE,
      });

      buyTicketUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/tickets')
        .send(buyTicketDto)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /tickets', () => {
    it('should return list of all tickets', async () => {
      const mockResponse = {
        items: [
          new Ticket({
            id: 'ticket-1',
            sessionId: 'session-1',
            userId: 'user-id',
            status: TicketStatus.ACTIVE,
          }),
          new Ticket({
            id: 'ticket-2',
            sessionId: 'session-2',
            userId: 'user-id',
            status: TicketStatus.USED,
          }),
        ],
        totalCount: 2,
      };

      getAllTicketUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/tickets')
        .query({ page: 0, limit: 10 })
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });
  });
});
