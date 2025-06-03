import { Decimal } from '@prisma/client/runtime/library';
import { MonthlyStats } from './monthly-stats.type';

export type UserStatsOptions = {
  includeMonthlyStats?: boolean;
  includeAverages?: boolean;
  includePeaks?: boolean;
  months?: number;
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
