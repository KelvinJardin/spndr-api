import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto';
import { TaxYearResponse, TaxYearStatsResponse } from "./types";
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TaxYearsService {
  constructor(private readonly prisma: PrismaService) {
  }

  async findAll(query: PaginationQueryDto) {
    const { limit, offset } = query;

    const [total, taxYears] = await Promise.all([
      this.prisma.taxYear.count(),
      this.prisma.taxYear.findMany({
        take: limit,
        skip: offset,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: taxYears,
      meta: {
        total,
        offset,
      },
    };
  }

  async findByYear(year: number): Promise<TaxYearResponse | null> {
    return this.prisma.taxYear.findFirst({
      where: {
        startYear: {
          equals: year
        }
      },
    });
  }

  async findOne(id: string): Promise<TaxYearResponse | null> {
    return this.prisma.taxYear.findUnique({
      where: { id },
    });
  }

  async findCurrent(): Promise<TaxYearResponse | null> {
    return this.prisma.taxYear.findFirst({
      where: { isCurrent: true },
    });
  }

  async getTaxYearStats(
    taxYearId: string,
    userId: string,
  ): Promise<TaxYearStatsResponse> {
    const transactions = await this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        taxYearId,
        userId,
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const categoryMappings = await this.prisma.taxCategoryMapping.findMany({
      where: { taxYearId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      },
    });

    const incomeByCategory: TaxYearStatsResponse['incomeByCategory'] = [];
    const expensesByCategory: TaxYearStatsResponse['expensesByCategory'] = [];
    let totalIncome = new Decimal(0);
    let totalExpenses = new Decimal(0);

    for (const transaction of transactions) {
      const mapping = categoryMappings.find(m => m.category.id === transaction.categoryId);
      if (!mapping) continue;

      const stats = {
        categoryId: mapping.category.id,
        categoryName: mapping.category.name,
        sa103fBox: mapping.sa103fBox,
        allowable: mapping.allowable,
        notes: mapping.notes,
        total: transaction._sum.amount ?? new Decimal(0),
        count: transaction._count,
      };

      if (mapping.category.type === TransactionType.INCOME) {
        incomeByCategory.push(stats);
        totalIncome = totalIncome.plus(stats.total);
      } else {
        expensesByCategory.push(stats);
        totalExpenses = totalExpenses.plus(stats.total);
      }
    }

    return {
      incomeByCategory,
      expensesByCategory,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome.minus(totalExpenses),
    };
  }
}