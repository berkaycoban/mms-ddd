import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import * as request from 'supertest';

import { GetWatchHistoryUseCase } from '@/modules/movie/application/use-cases/get-watch-history.use-case';
import { WatchMovieUseCase } from '@/modules/movie/application/use-cases/watch-movie.use-case';
import { Watch } from '@/modules/movie/domain/entities/watch.entity';
import { WatchMovieDTO } from '@/modules/movie/presentation/dtos/watch-movie.dto';
import { WatchController } from '@/modules/movie/presentation/watch.controller';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { IGetUser, UserRole } from '@/shared/types';

describe('WatchController (e2e)', () => {
  let app: INestApplication;

  let watchMovieUseCase: jest.Mocked<WatchMovieUseCase>;
  let getWatchHistoryUseCase: jest.Mocked<GetWatchHistoryUseCase>;

  beforeAll(async () => {
    const mockWatchMovieUseCase = { execute: jest.fn() };
    const mockGetWatchHistoryUseCase = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [
        { provide: WatchMovieUseCase, useValue: mockWatchMovieUseCase },
        {
          provide: GetWatchHistoryUseCase,
          useValue: mockGetWatchHistoryUseCase,
        },
        Reflector,
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

    watchMovieUseCase = moduleFixture.get(WatchMovieUseCase);
    getWatchHistoryUseCase = moduleFixture.get(GetWatchHistoryUseCase);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /watch', () => {
    it('should watch movie successfully', async () => {
      const watchMovieDto: WatchMovieDTO = {
        ticketId: 'ticket-uuid',
      };

      const mockResponse = new Watch({
        id: 'watch-uuid',
        userId: 'user-uuid',
        ticketId: 'ticket-uuid',
        sessionId: 'session-uuid',
        movieId: 'movie-uuid',
      });

      watchMovieUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/watch')
        .send(watchMovieDto)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /watch/history', () => {
    it('should return watch history', async () => {
      const mockResponse = {
        items: [
          new Watch({
            id: 'watch-uuid',
            userId: 'user-uuid',
            ticketId: 'ticket-uuid',
            sessionId: 'session-uuid',
            movieId: 'movie-uuid',
            createdAt: new Date().toISOString(),
          }),
        ],
        totalCount: 1,
      };

      getWatchHistoryUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/watch/history')
        .query({ page: 0, limit: 10 })
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });
  });
});
