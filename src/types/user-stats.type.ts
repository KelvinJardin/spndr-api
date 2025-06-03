import { Decimal } from '@prisma/client/runtime/library';

export type UserStatsOptions = {
  includeMonthlyStats?: boolean;
  includeAverages?: boolean;
  includePeaks?: boolean;
  months?: number;
};

export type MonthlyStats = {
  month: Date;
  income: number | Decimal;
  expenses: number | Decimal;
  net: Decimal;
};

export type UserStatsResponse = {
  monthlyStats?: MonthlyStats[];
  averages?: {
    monthlyIncome: number | Decimal;
    monthlyExpenses: number | Decimal;
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
