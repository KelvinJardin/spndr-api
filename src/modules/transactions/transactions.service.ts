import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { PaginationQueryDto } from '../../dtos';
import { TransactionResponse } from '../../types';
import { ImportTransactionDto, ImportType } from '../../dtos/import-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { parseISO } from 'date-fns';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {
  }

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
    const result = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    const { type, hobbyId, data } = importDto;
    const parsedTransactions = [];

    // Get all tax years
    const taxYears = await this.prisma.taxYear.findMany({
      orderBy: { startDate: 'desc' },
    });

    // Get all categories for mapping
    const categories = await this.prisma.transactionCategory.findMany();

    // First validate all records
    for (const [index, record] of data.entries()) {
      try {
        // Parse and validate required fields
        const date = parseISO(record.Date);
        const amount = new Decimal(record.Amount);
        const description = record.Description?.trim();
        const notes = record.Notes?.trim();
        
        if (!date || !amount || !description) {
          throw new Error('Missing required fields');
        }

        // Find matching tax year for the transaction date
        const taxYear = taxYears.find(
          ty => date >= ty.startDate && date <= ty.endDate
        );

        if (!taxYear) {
          throw new Error(`No tax year found for date ${record.Date}`);
        }

        // Map Intuit category to our category
        const category = type === ImportType.INTUIT ? this.mapIntuitCategory(record.Category, categories) : null;
        if (!category) {
          throw new Error(`Unknown category: ${record.Category}`);
        }

        // Store validated transaction data
        parsedTransactions.push({
          date,
          amount: amount.abs(),
          type: amount.isNegative() ? TransactionType.EXPENSE : TransactionType.INCOME,
          description,
          notes,
          userId,
          hobbyId,
          categoryId: category.id,
          taxYearId: taxYear.id,
          reference: record.Receipt || undefined,
        });
      } catch (error) {
        result.skipped++;
        result.errors.push(`Row ${index + 2}: ${error.message}`);
      }
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
        skipped: data.length,
        errors: [`Failed to import transactions: ${error.message}`],
      };
    }

    return result;
  }

  private mapIntuitCategory(intuitCategory: string, categories: any[]) {
    // Map common Intuit categories to our tax categories
    const categoryMap: Record<string, string> = {
      'Other business expenses': 'Other Business Expenses',
      'Cost of goods for resale': 'Cost of Goods',
      'Travel and transport': 'Travel and Transport',
      'Professional fees': 'Professional Fees',
      'Office costs': 'Office Costs',
      'Repairs and maintenance': 'Repairs and Maintenance',
      'Income': 'Turnover',
      'Sales': 'Turnover',
    };

    const mappedCategory = categoryMap[intuitCategory];
    return categories.find(c => c.name === mappedCategory);
  }
}