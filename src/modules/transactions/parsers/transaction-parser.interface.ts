import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface ParsedTransaction {
  date: Date;
  amount: Decimal;
  type: TransactionType;
  description: string;
  notes?: string;
  reference?: string;
  categoryName: string;
}

export interface TransactionParser {
  parse(data: Record<string, string>[]): ParsedTransaction[];
}