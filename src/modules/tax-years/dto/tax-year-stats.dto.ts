import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Sa103fBox } from '@prisma/client';

class CategoryStatsDto {
  @ApiProperty({ example: 'cln1234567890' })
  categoryId: string;

  @ApiProperty({ example: 'Freelance Work' })
  categoryName: string;

  @ApiProperty({ enum: Sa103fBox })
  sa103fBox: Sa103fBox;

  @ApiProperty({ example: '1500.00' })
  total: Decimal;

  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: true })
  allowable: boolean;

  @ApiProperty({ example: 'Additional notes about tax treatment', nullable: true })
  notes: string | null;
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