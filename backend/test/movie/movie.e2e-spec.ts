import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import * as request from 'supertest';

import { CreateMovieUseCase } from '@/modules/movie/application/use-cases/create-movie.use-case';
import { CreateSessionUseCase } from '@/modules/movie/application/use-cases/create-session.use-case';
import { DeleteMovieUseCase } from '@/modules/movie/application/use-cases/delete-movie.use-case';
import { GetAllAvailableMovie } from '@/modules/movie/application/use-cases/get-all-available-movie.use-case';
import { GetAllMovieUseCase } from '@/modules/movie/application/use-cases/get-all-movie.use-case';
import { GetAllSessionUseCase } from '@/modules/movie/application/use-cases/get-all-session.use-case';
import { UpdateMovieUseCase } from '@/modules/movie/application/use-cases/update-movie.use-case';
import { Movie } from '@/modules/movie/domain/entities/movie.entity';
import { CreateMovieDTO } from '@/modules/movie/presentation/dtos/create-movie.dto';
import { MovieController } from '@/modules/movie/presentation/movie.controller';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { IGetUser, UserRole } from '@/shared/types';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let createMovieUseCase: jest.Mocked<CreateMovieUseCase>;
  let getAllMovieUseCase: jest.Mocked<GetAllMovieUseCase>;
  let getAllAvailableMovieUseCase: jest.Mocked<GetAllAvailableMovie>;

  beforeAll(async () => {
    const mockCreateMovieUseCase = { execute: jest.fn() };
    const mockGetAllMovieUseCase = { execute: jest.fn() };
    const mockGetAllAvailableMovieUseCase = { execute: jest.fn() };
    const mockCreateSessionUseCase = { execute: jest.fn() };
    const mockGetAllSessionUse = { execute: jest.fn() };
    const mockUpdateMovieUseCase = { execute: jest.fn() };
    const mockDeleteMovieUseCase = { execute: jest.fn() };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        { provide: CreateMovieUseCase, useValue: mockCreateMovieUseCase },
        { provide: GetAllMovieUseCase, useValue: mockGetAllMovieUseCase },
        {
          provide: GetAllAvailableMovie,
          useValue: mockGetAllAvailableMovieUseCase,
        },
        { provide: CreateSessionUseCase, useValue: mockCreateSessionUseCase },
        { provide: GetAllSessionUseCase, useValue: mockGetAllSessionUse },
        { provide: UpdateMovieUseCase, useValue: mockUpdateMovieUseCase },
        { provide: DeleteMovieUseCase, useValue: mockDeleteMovieUseCase },
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

    createMovieUseCase = moduleFixture.get(CreateMovieUseCase);
    getAllMovieUseCase = moduleFixture.get(GetAllMovieUseCase);
    getAllAvailableMovieUseCase = moduleFixture.get(GetAllAvailableMovie);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /movies', () => {
    it('should create a new movie successfully', async () => {
      const createMovieDto: CreateMovieDTO = {
        name: 'Test Movie',
        ageRestriction: 18,
      };

      const mockResponse = new Movie({
        id: 'movie-uuid',
        name: 'Test Movie',
        ageRestriction: 18,
      });

      createMovieUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set(
          'user',
          JSON.stringify({
            role: UserRole.MANAGER,
          }),
        )
        .send(createMovieDto)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /movies', () => {
    it('should return list of all movies', async () => {
      const mockResponse = {
        items: [
          new Movie({
            id: 'movie-1',
            name: 'Movie 1',
            ageRestriction: 18,
          }),
          new Movie({
            id: 'movie-2',
            name: 'Movie 2',
            ageRestriction: 12,
          }),
        ],
        totalCount: 2,
      };

      getAllMovieUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ page: 0, limit: 10 })
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /movies/available', () => {
    it('should return list of available movies', async () => {
      const mockUser = {
        id: 'user-id',
        username: 'testuser',
        age: 20,
        role: UserRole.CUSTOMER,
      };

      const mockResponse = {
        items: [
          new Movie({
            id: 'movie-1',
            name: 'Available Movie 1',
            ageRestriction: 18,
          }),
        ],
        totalCount: 1,
      };

      getAllAvailableMovieUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/movies/available')
        .set('user', JSON.stringify(mockUser))
        .query({ page: 0, limit: 10 })
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });
  });
});
