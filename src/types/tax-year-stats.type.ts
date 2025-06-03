import { Decimal } from '@prisma/client/runtime/library';
import { Sa103fBox } from '@prisma/client';

type CategoryStats = {
  categoryId: string;
  categoryName: string;
  sa103fBox: Sa103fBox;
  total: Decimal;
  count: number;
  allowable: boolean;
  notes?: string;
};

export type TaxYearStatsResponse = {
  incomeByCategory: CategoryStats[];
  expensesByCategory: CategoryStats[];
  totalIncome: Decimal;
  totalExpenses: Decimal;
  netIncome: Decimal;
};