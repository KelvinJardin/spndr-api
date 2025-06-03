import { Decimal } from '@prisma/client/runtime/library';

export type HobbyStatsOptions = {
  includeMonthlyStats?: boolean;
  includeAverages?: boolean;
  includePeaks?: boolean;
  months?: number;
};

export type MonthlyStats = {
  month: Date;
  income: Decimal | number;
  expenses: Decimal | number;
  net: Decimal | number;
};

export type HobbyStatsResponse = {
  monthlyStats?: MonthlyStats[];
  averages?: {
    monthlyIncome: Decimal | number;
    monthlyExpenses: Decimal | number;
    monthlyNet: Decimal | number;
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