import { ForbiddenException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { LoginUseCase } from '@/modules/user/application/use-cases/login.use-case';
import { RegisterUseCase } from '@/modules/user/application/use-cases/register.use-case';
import { AuthController } from '@/modules/user/presentation/auth.controller';
import { LoginDTO } from '@/modules/user/presentation/dtos/login.dto';
import { RegisterDTO } from '@/modules/user/presentation/dtos/register.dto';
import { ResponseDTO } from '@/modules/user/presentation/dtos/response.dto';
import { UserRole } from '@/shared/types';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let registerUseCase: jest.Mocked<RegisterUseCase>;

  beforeAll(async () => {
    const mockLoginUseCase = {
      execute: jest.fn(),
    };
    const mockRegisterUseCase = {
      execute: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: RegisterUseCase, useValue: mockRegisterUseCase },
      ],
    }).compile();

    app = moduleFixture.createNestApplication<INestApplication>();
    await app.init();

    loginUseCase = moduleFixture.get(LoginUseCase);
    registerUseCase = moduleFixture.get(RegisterUseCase);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return token and user data on successful login', async () => {
      const loginDto: LoginDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse: ResponseDTO = {
        token: 'mock-jwt-token',
        user: {
          id: 'user-uuid',
          username: 'testuser',
          role: UserRole.CUSTOMER,
          age: 25,
        },
      };
      loginUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });

    it('should throw ForbiddenException on invalid credentials', async () => {
      const loginDto: LoginDTO = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      loginUseCase.execute.mockRejectedValue(
        new ForbiddenException('Invalid credentials!'),
      );

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(403);

      expect((response.body as { message: string }).message).toBe(
        'Invalid credentials!',
      );
    });
  });

  describe('POST /auth/register', () => {
    it('should return token and user data on successful registration', async () => {
      const registerDto: RegisterDTO = {
        username: 'newuser',
        password: 'password123',
        age: 30,
      };

      const mockResponse: ResponseDTO = {
        token: 'mock-jwt-token',
        user: {
          id: 'new-user-uuid',
          username: 'newuser',
          role: UserRole.CUSTOMER,
          age: 30,
        },
      };
      registerUseCase.execute.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
    });

    it('should throw ForbiddenException if username already exists', async () => {
      const registerDto: RegisterDTO = {
        username: 'existinguser',
        password: 'password123',
        age: 25,
      };

      registerUseCase.execute.mockRejectedValue(
        new ForbiddenException(
          'Registration could not be completed. Please try a different username.',
        ),
      );

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(403);

      expect((response.body as { message: string }).message).toBe(
        'Registration could not be completed. Please try a different username.',
      );
    });
  });
});
