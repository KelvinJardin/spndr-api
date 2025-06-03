import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { HobbyResponse } from '../../types/hobby.type';
import {
  HobbyStatsOptions,
  HobbyStatsResponse,
  MonthlyStats,
} from '../../types/hobby-stats.type';
import { TransactionType } from '@prisma/client';

@Injectable()
export class HobbiesService {
  constructor(private prisma: PrismaService) {}

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
    const { months = 12 } = options;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const response: HobbyStatsResponse = {};

    // Base query for transactions within the time period
    const baseWhere = {
      userId,
      hobbyId,
      date: {
        gte: startDate,
      },
    };

    if (options.includeMonthlyStats) {
      const monthlyStats: MonthlyStats[] = [];

      for (let i = 0; i < months; i++) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - i);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const monthTransactions = await this.prisma.transaction.groupBy({
          by: ['type'],
          where: {
            ...baseWhere,
            date: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const income =
          monthTransactions.find((t) => t.type === TransactionType.INCOME)?._sum
            .amount ?? 0;
        const expenses =
          monthTransactions.find((t) => t.type === TransactionType.EXPENSE)
            ?._sum.amount ?? 0;

        const stats: MonthlyStats = {
          month: monthStart,
          income,
          expenses,
          net: new Decimal(income).minus(new Decimal(expenses)),
        };
        monthlyStats.push(stats);
      }

      response.monthlyStats = monthlyStats;
    }

    if (options.includeAverages) {
      const averages = await this.prisma.transaction.groupBy({
        by: ['type'],
        where: baseWhere,
        _avg: {
          amount: true,
        },
      });

      const monthlyIncome =
        averages.find((a) => a.type === TransactionType.INCOME)?._avg.amount ??
        0;
      const monthlyExpenses =
        averages.find((a) => a.type === TransactionType.EXPENSE)?._avg.amount ??
        0;

      response.averages = {
        monthlyIncome,
        monthlyExpenses,
        monthlyNet: new Decimal(monthlyIncome).minus(
          new Decimal(monthlyExpenses),
        ),
      };
    }

    if (options.includePeaks) {
      const [highestIncome, highestExpense] = await Promise.all([
        this.prisma.transaction.findFirst({
          where: {
            ...baseWhere,
            type: TransactionType.INCOME,
          },
          orderBy: {
            amount: 'desc',
          },
          select: {
            amount: true,
            date: true,
            description: true,
          },
        }),
        this.prisma.transaction.findFirst({
          where: {
            ...baseWhere,
            type: TransactionType.EXPENSE,
          },
          orderBy: {
            amount: 'desc',
          },
          select: {
            amount: true,
            date: true,
            description: true,
          },
        }),
      ]);

      if (highestIncome || highestExpense) {
        response.peaks = {
          ...(highestIncome && {
            highestIncome: {
              amount: highestIncome.amount,
              date: highestIncome.date,
              description: highestIncome.description,
            },
          }),
          ...(highestExpense && {
            highestExpense: {
              amount: highestExpense.amount,
              date: highestExpense.date,
              description: highestExpense.description,
            },
          }),
        };
      }
    }

    return response;
  }
}
