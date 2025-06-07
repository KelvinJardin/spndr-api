import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';
import { NotFoundException } from '@nestjs/common';
import type { HobbyResponse, HobbyStatsResponse } from './types';
import { Prisma } from '@prisma/client';

describe('HobbiesController', () => {
  let controller: HobbiesController;
  let service: HobbiesService;

  const mockHobby: HobbyResponse = {
    id: 'test-id',
    name: 'Photography',
    description: 'Wedding photography',
    isActive: true,
    userId: 'user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: {
      count: 5,
    },
  };

  const mockStats: HobbyStatsResponse = {
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
      controllers: [HobbiesController],
      providers: [
        {
          provide: HobbiesService,
          useValue: {
            findAll: () => Promise.resolve([mockHobby]),
            findOne: (userId: string, id: string) =>
              id === mockHobby.id && userId === mockHobby.userId
                ? Promise.resolve(mockHobby)
                : Promise.resolve(null),
            getHobbyStats: () => Promise.resolve(mockStats),
          },
        },
      ],
    }).compile();

    controller = module.get<HobbiesController>(HobbiesController);
    service = module.get<HobbiesService>(HobbiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of hobbies', async () => {
      const result = await controller.findAll(
        mockHobby.userId,
        {
          limit: 10,
          offset: 0,
        },
      );
      expect(result).toEqual([mockHobby]);
      expect(service.findAll).toHaveBeenCalledWith(mockHobby.userId);
    });
  });

  describe('findOne', () => {
    it('should return a hobby when it exists', async () => {
      const result = await controller.findOne(mockHobby.userId, mockHobby.id);
      expect(result).toEqual(mockHobby);
      expect(service.findOne).toHaveBeenCalledWith(
        mockHobby.userId,
        mockHobby.id,
      );
    });

    it('should throw NotFoundException when hobby does not exist', async () => {
      await expect(
        controller.findOne(mockHobby.userId, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return hobby stats', async () => {
      const result = await controller.getStats(
        mockHobby.userId,
        mockHobby.id,
        12,
        true,
        true,
        true,
      );
      expect(result).toEqual(mockStats);
    });

    it('should throw NotFoundException for non-existent hobby', async () => {
      await expect(
        controller.getStats('user-id', 'non-existent', 12, true, true, true),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
