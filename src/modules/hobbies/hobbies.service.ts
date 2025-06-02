import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HobbyResponse } from '../../types/hobby.type';

@Injectable()
export class HobbiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<HobbyResponse[]> {
    return this.prisma.hobby.findMany({
      where: { userId },
    });
  }

  async findOne(userId: string, id: string): Promise<HobbyResponse | null> {
    return this.prisma.hobby.findFirst({
      where: { 
        id,
        userId,
      },
    });
  }
}