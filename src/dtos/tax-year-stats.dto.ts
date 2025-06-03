import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

class CategoryStatsDto {
  @ApiProperty({ example: 'cln1234567890' })
  categoryId: string;

  @ApiProperty({ example: 'Freelance Work' })
  categoryName: string;

  @ApiProperty({ example: '1500.00' })
  total: Decimal;

  @ApiProperty({ example: 10 })
  count: number;
}

export class TaxYearStatsDto {
  @ApiProperty({ type: [CategoryStatsDto] })
  incomeByCategory: CategoryStatsDto[];

  @ApiProperty({ type: [CategoryStatsDto] })
  expensesByCategory: CategoryStatsDto[];

  @ApiProperty({ example: '5000.00' })
  totalIncome: Decimal;

  @ApiProperty({ example: '1500.00' })
  totalExpenses: Decimal;

  @ApiProperty({ example: '3500.00' })
  netIncome: Decimal;
}