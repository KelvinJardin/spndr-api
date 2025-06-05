import { Prisma } from '@prisma/client';

export type ParsedTransaction = Omit<
  Prisma.TransactionCreateManyInput,
  'id' | 'userId' | 'hobbyId' | 'categoryId' | 'taxYearId' | 'createdAt' | 'updatedAt'
>;

export interface TransactionParser {
  parse(data: Record<string, string>[]): ParsedTransaction[];
}