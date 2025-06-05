import { Injectable } from '@nestjs/common';
import { TransactionParser, ParsedTransaction } from './transaction-parser.interface';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { parse } from 'date-fns';

@Injectable()
export class IntuitParserService implements TransactionParser {
  parse(data: Record<string, string>[]): ParsedTransaction[] {
    return data.map(record => {
      const amount = new Decimal(record.Amount);
      
      return {
        date: parse(record.Date, 'dd/MM/yyyy', new Date()),
        amount: amount.abs(),
        type: amount.isNegative() ? TransactionType.EXPENSE : TransactionType.INCOME,
        description: record.Description?.trim() ?? '',
        notes: record.Notes?.trim(),
        reference: record.Receipt?.trim(),
        categoryName: this.mapCategory(record.Category),
      };
    });
  }

  private mapCategory(category: string): string {
    // Map Intuit categories to our transaction categories
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

    return categoryMap[category] ?? 'Other Business Expenses';
  }
}