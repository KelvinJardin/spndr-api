import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import type { UserResponse, UserStatsResponse } from './types';
import { Prisma } from '@prisma/client';

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

  const mockStats: UserStatsResponse = {
    monthlyStats: [],
    averages: {
      monthlyIncome: new Prisma.Decimal(1500),
      monthlyExpenses: new Prisma.Decimal(500),
      monthlyNet: new Prisma.Decimal(1000),
    },
    peaks: {
      highestIncome: {
        amount: new Prisma.Decimal(2500),
        date: new Date(),
        description: 'Test Income',
      },
      highestExpense: {
        amount: new Prisma.Decimal(1000),
        date: new Date(),
        description: 'Test Expense',
      },
    },
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
            getUserStats: () => Promise.resolve(mockStats),
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
      const result = await controller.findAll({
        limit: 10,
        offset: 0,
      });
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

    it('should throw NotFoundException when the user does not exist', async () => {
      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('should return user stats', async () => {
      const result = await controller.getStats(
        mockUser.id,
        12,
        true,
        true,
        true,
      );
      expect(result).toEqual(mockStats);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      await expect(
        controller.getStats('non-existent', 12, true, true, true),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
