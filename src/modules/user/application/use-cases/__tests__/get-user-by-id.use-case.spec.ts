import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserDTO } from '../../../presentation/dtos/user.dto';
import { GetUserByIdUseCase } from '../get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should get user by id successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute('1');

    expect(result).toBeInstanceOf(UserDTO);
    expect(result).toEqual(expect.objectContaining(mockUser));
  });

  it('should throw NotFoundException when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('1')).rejects.toThrow('User not found!');
  });
});
