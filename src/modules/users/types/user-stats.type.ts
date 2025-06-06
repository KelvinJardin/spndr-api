import { Decimal } from '@prisma/client/runtime/library';

export type UserStatsOptions = {
  includeMonthlyStats?: boolean;
  includeAverages?: boolean;
  includePeaks?: boolean;
  months?: number;
};

export type MonthlyStats = {
  month: Date;
  income: Decimal;
  expenses: Decimal;
  net: Decimal;
};

export type UserStatsResponse = {
  monthlyStats?: MonthlyStats[];
  averages?: {
    monthlyIncome: Decimal;
    monthlyExpenses: Decimal;
    monthlyNet: Decimal;
  };
  peaks?: {
    highestIncome?: {
      amount: Decimal;
      date: Date;
      description: string;
    };
    highestExpense?: {
      amount: Decimal;
      date: Date;
      description: string;
    };
  };
};