import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { PaginationQueryDto } from '../../dtos';
import { ImportTransactionDto, ImportType } from '../../dtos/import-transaction.dto';
import { ParsedTransaction } from './parsers/parser.interface';
import { Prisma } from '@prisma/client';
import { ParserFactory } from './parsers/parser.factory';
import { TransactionResponse } from '../../types';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private parserFactory: ParserFactory,
  ) {}

  async findAll(
    userId: string,
    query: PaginationQueryDto,
    hobbyId?: string,
  ) {
    const { limit, offset } = query;

    const where = {
      userId,
      ...(hobbyId ? { hobbyId } : {}),
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
            (ty) => (date >= ty.startDate && date <= ty.endDate)
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
        } catch (error) {
          const row = index + 1;
          result.errors.push({
            row,
            error: error.message
          });
        }
      }
    } catch (error) {
      return {
        imported: 0,
        errors: [`Failed to parse transactions: ${error.message}`],
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
        errors: [`Failed to import transactions: ${error.message}`],
      };
    }

    return result;
  }

  private mapCategory(type: ImportType, transaction: ParsedTransaction): string {
    if (type === ImportType.INTUIT) {
      const categoryMap: Record<string, string> = {
        'Other business expenses': 'Other Business Expenses',
        'Cost of goods for resale': 'Cost of Goods',
        'Travel and transport': 'Travel and Transport',
        'Professional fees': 'Professional Fees',
        'Office costs': 'Office Costs',
        'Repairs and maintenance': 'Repairs and Maintenance',
        'Business income': 'Turnover',
        'Sales': 'Turnover',
      };

      return categoryMap[transaction.type] ?? 'Other Business Expenses';
    }
    throw new Error(`Unsupported import type: ${type}`);
  }
}