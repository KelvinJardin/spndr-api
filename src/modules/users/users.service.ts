import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponse } from '../../types/user.type';
import { UserStatsOptions, UserStatsResponse } from '../../types/user-stats.type';
import { TransactionType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
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
    const { months = 12 } = options;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const response: UserStatsResponse = {};

    // Base query for transactions within the time period
    const baseWhere = {
      userId,
      date: {
        gte: startDate,
      },
    };

    if (options.includeMonthlyStats) {
      const transactions = await this.prisma.transaction.groupBy({
        by: ['type'],
        where: baseWhere,
        _sum: {
          amount: true,
        },
        having: {
          type: {
            in: [TransactionType.INCOME, TransactionType.EXPENSE],
          },
        },
      });

      const monthlyStats = [];
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

        const income = monthTransactions.find(
          (t) => t.type === TransactionType.INCOME,
        )?._sum.amount ?? 0;
        const expenses = monthTransactions.find(
          (t) => t.type === TransactionType.EXPENSE,
        )?._sum.amount ?? 0;

        monthlyStats.push({
          month: monthStart,
          income,
          expenses,
          net: income.minus(expenses),
        });
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
        averages.find((a) => a.type === TransactionType.INCOME)?._avg.amount ?? 0;
      const monthlyExpenses =
        averages.find((a) => a.type === TransactionType.EXPENSE)?._avg.amount ??
        0;

      response.averages = {
        monthlyIncome,
        monthlyExpenses,
        monthlyNet: monthlyIncome.minus(monthlyExpenses),
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