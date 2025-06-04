import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { PaginationQueryDto } from '../../dtos';
import { TransactionResponse, TransactionType } from '../../types';
import { parse } from 'csv-parse/sync';
import { Decimal } from '@prisma/client/runtime/library';
import { parseISO } from 'date-fns';

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

  async importIntuitCsv(userId: string, csvContent: string) {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const result = {
      imported: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Get current tax year
    const currentTaxYear = await this.prisma.taxYear.findFirst({
      where: { isCurrent: true },
    });

    if (!currentTaxYear) {
      throw new Error('No current tax year found');
    }

    // Get all categories for mapping
    const categories = await this.prisma.transactionCategory.findMany();

    for (const [index, record] of records.entries()) {
      try {
        // Parse and validate required fields
        const date = parseISO(record.Date);
        const amount = new Decimal(record.Amount);
        const description = record.Description?.trim();
        const notes = record.Notes?.trim();
        
        if (!date || !amount || !description) {
          throw new Error('Missing required fields');
        }

        // Map Intuit category to our category
        const category = this.mapIntuitCategory(record.Category, categories);
        if (!category) {
          throw new Error(`Unknown category: ${record.Category}`);
        }

        // Create transaction
        await this.prisma.transaction.create({
          data: {
            date,
            amount: amount.abs(),
            type: amount.isNegative() ? TransactionType.EXPENSE : TransactionType.INCOME,
            description,
            notes,
            userId,
            categoryId: category.id,
            taxYearId: currentTaxYear.id,
            reference: record.Receipt || undefined,
          },
        });

        result.imported++;
      } catch (error) {
        result.skipped++;
        result.errors.push(`Row ${index + 2}: ${error.message}`);
      }
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