import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsService } from '../../services/stats.service';
import type { HobbyResponse } from '../../types/hobby.type';
import type {
  HobbyStatsOptions,
  HobbyStatsResponse,
} from '../../types/hobby-stats.type';

@Injectable()
export class HobbiesService {
  constructor(
    private prisma: PrismaService,
    private statsService: StatsService,
  ) {}

  async findAll(userId: string): Promise<HobbyResponse[]> {
    const hobbies = await this.prisma.hobby.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return hobbies.map((hobby) => ({
      ...hobby,
      transactions: {
        count: hobby._count.transactions,
      },
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
          select: { transactions: true },
        },
      },
    });

    if (!hobby) return null;

    return {
      ...hobby,
      transactions: {
        count: hobby._count.transactions,
      },
    };
  }

  async getHobbyStats(
    userId: string,
    hobbyId: string,
    options: HobbyStatsOptions,
  ): Promise<HobbyStatsResponse> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (options.months ?? 12));

    // Base query for transactions within the time period
    const baseWhere = {
      userId,
      hobbyId,
      date: {
        gte: startDate,
      },
    };

    return this.statsService.getStats(baseWhere, options);
  }
}
