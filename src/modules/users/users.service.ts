import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsService } from '../../services/stats.service';
import { PaginationQueryDto } from '../../dtos/pagination.dto';
import type { UserResponse } from '../../types/user.type';
import type {
  UserStatsOptions,
  UserStatsResponse,
} from '../../types/user-stats.type';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private statsService: StatsService,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const [total, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
          provider: true,
          providerAccountId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: query.page,
        lastPage: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: string): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        provider: true,
        providerAccountId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserStats(
    userId: string,
    options: UserStatsOptions,
  ): Promise<UserStatsResponse> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (options.months ?? 12));

    // Base query for transactions within the time period
    const baseWhere = {
      userId,
      date: {
        gte: startDate,
      },
    };

    return this.statsService.getStats(baseWhere, options);
  }
}