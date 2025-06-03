import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';
import { MonthlyStats } from '../types/user-stats.type';

export interface StatsOptions {
  includeMonthlyStats?: boolean;
  includeAverages?: boolean;
  includePeaks?: boolean;
  months?: number;
}

export interface StatsResponse {
  monthlyStats?: MonthlyStats[];
  averages?: {
    monthlyIncome: Decimal;
    monthlyExpenses: Decimal;
    monthlyNet: Decimal;
  };
  peaks?: {
    highestIncome?: {
      amount: Decimal;
      date: Date;
      description: string;
    };
    highestExpense?: {
      amount: Decimal;
      date: Date;
      description: string;
    };
  };
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(
    baseWhere: Record<string, any>,
    options: StatsOptions,
  ): Promise<StatsResponse> {
    const { months = 12 } = options;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const response: StatsResponse = {};

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
            .amount ?? new Decimal(0);
        const expenses =
          monthTransactions.find((t) => t.type === TransactionType.EXPENSE)?._sum
            .amount ?? new Decimal(0);

        monthlyStats.push({
          month: monthStart,
          income,
          expenses,
          net: new Decimal(income).minus(new Decimal(expenses)),
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

      const monthlyIncome = new Decimal(
        averages.find((a) => a.type === TransactionType.INCOME)?._avg.amount ?? 0,
      );
      const monthlyExpenses = new Decimal(
        averages.find((a) => a.type === TransactionType.EXPENSE)?._avg.amount ?? 0,
      );

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