import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UserResponse } from '../../types/user.type';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: UserResponse = {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    type: 'user',
    provider: 'email',
    providerAccountId: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: () => Promise.resolve([mockUser]),
            findOne: (id: string) =>
              id === mockUser.id
                ? Promise.resolve(mockUser)
                : Promise.resolve(null),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when it exists', async () => {
      const result = await controller.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
