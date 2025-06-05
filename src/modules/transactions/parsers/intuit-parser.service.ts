import { Injectable } from '@nestjs/common';
import { TransactionParser, ParsedTransaction } from './parser.interface';
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
        amount: amount,
        type: amount.isNegative() ? TransactionType.EXPENSE : TransactionType.INCOME,
        description: record.Description?.trim() ?? '',
        notes: record.Notes?.trim() || null,
        reference: record.Receipt?.trim() || null,
      };
    });
  }
}