import { Decimal } from '@prisma/client/runtime/library';

type CategoryStats = {
  categoryId: string;
  categoryName: string;
  total: Decimal;
  count: number;
};

export type TaxYearStatsResponse = {
  incomeByCategory: CategoryStats[];
  expensesByCategory: CategoryStats[];
  totalIncome: Decimal;
  totalExpenses: Decimal;
  netIncome: Decimal;
};