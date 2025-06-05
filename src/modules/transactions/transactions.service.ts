import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { PaginationQueryDto } from '../../dtos';
import { ImportTransactionDto } from '../../dtos/import-transaction.dto';
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
      imported: 0 as number,
      errors: [] as { row: number, error: string }[],
    };

    const { type, hobbyId, data } = importDto;

    // Get all tax years
    const taxYears = await this.prisma.taxYear.findMany({
      orderBy: { startDate: 'desc' },
    });

    // Get all categories for mapping
    const categories = await this.prisma.transactionCategory.findMany();
    const categoryMap = new Map(categories.map(c => [c.name, c]));

    // Parse all transactions
    let parsedTransactions: Prisma.TransactionCreateManyInput[] = [];

    // First validate all records
    try {
      const parsed = parser.parse(data);
      
      for (const [index, transaction] of parsed.entries()) {
        try {
          const { date, amount, type, description, notes, reference, categoryName } = transaction;

          // Find matching tax year for the transaction date
          const taxYear = taxYears.find(
            ty => date >= ty.startDate && date <= ty.endDate
          );

          if (!taxYear) {
            throw new Error(`No tax year found for date ${record.Date}`);
          }

          // Find matching category
          const category = categoryMap.get(categoryName);

          if (!category) {
            throw new Error(`Unknown category: ${categoryName}`);
          }

          // Store validated transaction data
          parsedTransactions.push({
            date,
            amount,
            type,
            description,
            notes,
            userId,
            hobbyId,
            categoryId: category.id,
            taxYearId: taxYear.id,
            reference,
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
}