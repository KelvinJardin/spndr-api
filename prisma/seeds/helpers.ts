import { Prisma, TransactionType } from '@prisma/client';
import { addMonths, eachMonthOfInterval } from 'date-fns';

export function generateRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

export function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMonthlyTransactions(
  userId: string,
  hobbyId: string | null,
  categoryId: string,
  taxYearId: string,
  type: TransactionType,
  month: Date,
  count: number = 20,
  minAmount: number = 10,
  maxAmount: number = type === TransactionType.INCOME ? 2000 : 500,
): Prisma.TransactionCreateManyInput[] {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  return Array.from({ length: count }, (): Prisma.TransactionCreateManyInput => ({
    type,
    amount: new Prisma.Decimal(
      type === TransactionType.EXPENSE
        ? -generateRandomAmount(minAmount, maxAmount)
        : generateRandomAmount(minAmount, maxAmount),
    ),
    date: generateRandomDate(startOfMonth, endOfMonth),
    description: type === TransactionType.INCOME
      ? 'Project Payment'
      : 'Equipment Purchase',
    reference: `${type}-${month.getFullYear()}${(month.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`,
    userId,
    hobbyId,
    categoryId,
    taxYearId,
  }));
}

export async function generateTransactionsForDateRange(
  userId: string,
  hobbyId: string | null,
  incomeCategory: { id: string },
  expenseCategories: { id: string }[],
  taxYears: { id: string; startDate: Date; endDate: Date }[],
  startDate: Date,
  endDate: Date,
): Promise<Prisma.TransactionCreateManyInput[]> {
  const transactions: Prisma.TransactionCreateManyInput[] = [];
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  for (const currentDate of months) {
    const taxYear = taxYears.find(
      ty => currentDate >= ty.startDate && currentDate <= ty.endDate
    );

    if (taxYear) {
      // Generate income transactions
      transactions.push(
        ...generateMonthlyTransactions(
          userId,
          hobbyId,
          incomeCategory.id,
          taxYear.id,
          TransactionType.INCOME,
          currentDate,
          Math.floor(Math.random() * 10) + 15 // 15-25 transactions
        )
      );

      // Generate expense transactions
      transactions.push(
        ...generateMonthlyTransactions(
          userId,
          hobbyId,
          expenseCategories[Math.floor(Math.random() * expenseCategories.length)].id,
          taxYear.id,
          TransactionType.EXPENSE,
          currentDate,
          Math.floor(Math.random() * 10) + 15 // 15-25 transactions
        )
      );
    }
  }

  return transactions;
}