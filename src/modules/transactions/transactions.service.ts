import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto';
import { CreateTransactionDto, ImportTransactionDto, ImportType, UpdateTransactionDto } from './dto';
import { FilterOptionDto, TransactionFilterOptionsDto, TransactionFiltersDto } from './dto';
import { ParsedTransaction } from './parsers/parser.interface';
import { Prisma, TransactionType } from '@prisma/client';
import { ParserFactory } from './parsers/parser.factory';
import { TransactionResponse } from './types';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parserFactory: ParserFactory,
  ) {
  }

  async findAll(
    userId: string,
    query: PaginationQueryDto,
    filters?: TransactionFiltersDto,
  ) {
    const { limit, offset } = query;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.hobbyId && { hobbyId: filters.hobbyId }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.search && {
        description: {
          contains: filters.search,
          mode: 'insensitive',
        },
      }),
      ...(filters?.dateFrom || filters?.dateTo) && {
        date: {
          ...(filters?.dateFrom && { gte: new Date(filters.dateFrom) }),
          ...(filters?.dateTo && { lte: new Date(filters.dateTo) }),
        },
      },
      ...(filters?.amountFrom || filters?.amountTo) && {
        amount: {
          ...(filters?.amountFrom && { gte: filters.amountFrom }),
          ...(filters?.amountTo && { lte: filters.amountTo }),
        },
      },
    };

    const [total, transactions] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        offset: query.offset,
      },
    };
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<TransactionResponse | null> {
    return this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async create(
    userId: string,
    createDto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    const taxYear = await this.prisma.taxYear.findFirst({
      where: {
        startDate: {
          lte: new Date(createDto.date),
        },
        endDate: {
          gte: new Date(createDto.date),
        },
      },
    });

    if (!taxYear) {
      throw new Error('No tax year found');
    }

    return this.prisma.transaction.create({
      data: {
        ...createDto,
        date: new Date(createDto.date),
        userId,
        taxYearId: taxYear.id,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    updateDto: UpdateTransactionDto,
  ): Promise<TransactionResponse | null> {
    try {
      return await this.prisma.transaction.update({
        where: {
          id,
          userId,
        },
        data: {
          ...updateDto,
          ...(updateDto.date && { date: new Date(updateDto.date) }),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<boolean> {
    try {
      await this.prisma.transaction.delete({
        where: {
          id,
          userId,
        },
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async getFilterOptions(userId: string): Promise<TransactionFilterOptionsDto> {
    // Get user's hobbies for hobby filter
    const hobbies = await this.prisma.hobby.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    // Get user's categories for category filter
    const categories = await this.prisma.transactionCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });

    // Get date range from user's transactions
    const dateRange = await this.prisma.transaction.aggregate({
      where: { userId },
      _min: { date: true },
      _max: { date: true },
    });

    // Get amount range from user's transactions
    const amountRange = await this.prisma.transaction.aggregate({
      where: { userId },
      _min: { amount: true },
      _max: { amount: true },
    });

    const filters: FilterOptionDto[] = [
      {
        type: 'type',
        label: 'Transaction Type',
        inputType: 'select',
        options: Object.values(TransactionType),
      },
      {
        type: 'hobbyId',
        label: 'Hobby',
        inputType: 'select',
        options: hobbies.map(hobby => `${hobby.id}:${hobby.name}`),
      },
      {
        type: 'categoryId',
        label: 'Category',
        inputType: 'select',
        options: categories.map(category => `${category.id}:${category.name}`),
      },
      {
        type: 'date',
        label: 'Date Range',
        inputType: 'date-range',
        range: dateRange._min.date && dateRange._max.date ? {
          from: dateRange._min.date.toISOString().split('T')[0],
          to: dateRange._max.date.toISOString().split('T')[0],
        } : undefined,
      },
      {
        type: 'amount',
        label: 'Amount Range',
        inputType: 'number-range',
        range: amountRange._min.amount && amountRange._max.amount ? {
          from: amountRange._min.amount.toString(),
          to: amountRange._max.amount.toString(),
        } : undefined,
      },
    ];

    return { filters };
  }

  async importCsv(userId: string, importDto: ImportTransactionDto) {
    const parser = this.parserFactory.getParser(importDto.type);
    const result = {
      imported: 0,
      errors: [] as { row: number, error: string }[],
    };

    const { type, hobbyId, data } = importDto;

    const taxYears = await this.prisma.taxYear.findMany({
      orderBy: { startDate: 'desc' },
    });

    const categories = await this.prisma.transactionCategory.findMany();
    const categoryMap = new Map(categories.map(c => [c.name, c]));

    let parsedTransactions: Prisma.TransactionCreateManyInput[] = [];

    try {
      const parsed = parser.parse(data);

      for (const [index, transaction] of parsed.entries()) {
        try {
          const { date } = transaction;

          const taxYear = taxYears.find(
            (ty) => (date >= ty.startDate && date <= ty.endDate),
          );

          if (!taxYear) {
            throw new Error(`No tax year found for date ${new Date(date).toISOString()}`);
          }

          const category = categoryMap.get(this.mapCategory(importDto.type, transaction));

          if (!category) {
            throw new Error('Unknown category');
          }

          parsedTransactions.push({
            ...transaction,
            userId,
            hobbyId,
            categoryId: category.id,
            taxYearId: taxYear.id,
          });
        } catch ({ message: error }) {
          const row = (index + 1);

          result.errors.push({ row, error });
        }
      }
    } catch (error) {
      return {
        imported: 0,
        error: `Failed to parse transactions: ${error.message}`,
      };
    }

    // If any validation failed, return without importing
    if (result.errors.length > 0) {
      return result;
    }

    try {
      // Import all transactions in a single transaction
      await this.prisma.$transaction(async (tx) => {
        for (const transactionData of parsedTransactions) {
          await tx.transaction.create({
            data: transactionData,
          });
          result.imported++;
        }
      });
    } catch (error) {
      return {
        imported: 0,
        error: `Failed to import transactions: ${error.message}`,
      };
    }

    return result;
  }

  private mapCategory(type: ImportType, transaction: ParsedTransaction): string {
    if (type === ImportType.INTUIT) {
      const categoryMap: Record<string, string> = {
        'Other business expenses': 'Other business expenses',
        'Cost of goods for resale': 'Cost of goods for resale',
        'Car, van and travel expenses': 'Car / Van / Travel expenses',
        'Professional fees': 'Accountancy / Legal / Other professional fees',
        'Phone, fax, stationery and other office costs': 'Office supplies',
        'Repairs and maintenance': 'Property / Equipment Repairs',
        'Business income': 'Sales',
        'Sales': 'Sales',
        'Bank charges': 'Financial charges',
        'Interest': 'Bank interest / Loans',
        'Advertising': 'Advertising / Business entertainment',
        'Bad debts': 'Bad debts',
        'Depreciation': 'Asset Depreciation',
        'Wages and salaries': 'Wages, salaries and other staff costs',
        'Construction industry': 'Construction subcontractors',
        'Disallowable': 'Disallowable expenses',
      };

      return categoryMap[transaction.type] ?? 'Other business expenses';
    }
    throw new Error(`Unsupported import type: ${type}`);
  }
}