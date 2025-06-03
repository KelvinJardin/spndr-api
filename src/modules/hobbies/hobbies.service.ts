import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HobbyResponse } from '../../types/hobby.type';

@Injectable()
export class HobbiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<HobbyResponse[]> {
    const hobbies = await this.prisma.hobby.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    return hobbies.map(hobby => ({
      ...hobby,
      transactionCount: hobby._count.transactions
    }));
  }

  async findOne(userId: string, id: string): Promise<HobbyResponse | null> {
    const hobby = await this.prisma.hobby.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!hobby) return null;

    return {
      ...hobby,
      transactionCount: hobby._count.transactions
    };
  }
}
