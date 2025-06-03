import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';
import { NotFoundException } from '@nestjs/common';
import { HobbyResponse } from '../../types/hobby.type';

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
      const result = await controller.findAll(mockHobby.userId);
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
});
