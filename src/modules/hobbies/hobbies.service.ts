import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsService } from '../../services/stats.service';
import { PaginationQueryDto } from '../../dtos/pagination.dto';
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

  async findAll(userId: string, query: PaginationQueryDto) {
    const [total, hobbies] = await Promise.all([
      this.prisma.hobby.count({
        where: { userId },
      }),
      this.prisma.hobby.findMany({
        where: { userId },
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { transactions: true },
          },
        },
      }),
    ]);

    return {
      data: hobbies.map(hobby => ({
        ...hobby,
        transactions: {
          count: hobby._count.transactions,
        },
      })),
      meta: {
        total,
        page: query.page,
        lastPage: Math.ceil(total / query.limit),
      },
    };
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
