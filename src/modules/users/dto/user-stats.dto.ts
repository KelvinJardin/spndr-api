import { ApiProperty } from "@nestjs/swagger";

class MonthlyStatsDto {
  @ApiProperty()
  month: Date;

  @ApiProperty({ example: '1250.00' })
  income: string;

  @ApiProperty({ example: '450.00' })
  expenses: string;

  @ApiProperty({ example: '800.00' })
  net: string;
}

class AveragesDto {
  @ApiProperty({ example: '1500.00' })
  monthlyIncome: string;

  @ApiProperty({ example: '500.00' })
  monthlyExpenses: string;

  @ApiProperty({ example: '1000.00' })
  monthlyNet: string;
}

class PeakTransactionDto {
  @ApiProperty({ example: '2500.00' })
  amount: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ example: 'Website Development Project' })
  description: string;
}

class PeaksDto {
  @ApiProperty()
  highestIncome: PeakTransactionDto;

  @ApiProperty()
  highestExpense: PeakTransactionDto;
}

export class UserStatsDto {
  @ApiProperty({ type: [MonthlyStatsDto], required: false })
  monthlyStats?: MonthlyStatsDto[];

  @ApiProperty({ required: false })
  averages?: AveragesDto;

  @ApiProperty({ required: false })
  peaks?: PeaksDto;
}