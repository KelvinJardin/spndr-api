import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ImportTransactionDto {
  @ApiProperty({
    description: 'CSV content as a string',
    example: 'Date,Bank,Account,Description,Amount,Type,Category,Receipt,Notes\n2024-01-01,Bank,Account,Test Transaction,100.00,Income,Turnover,,Test note',
  })
  @IsString()
  @IsNotEmpty()
  csvContent: string;
}

export class ImportTransactionResponseDto {
  @ApiProperty({
    description: 'Number of transactions successfully imported',
    example: 10,
  })
  imported: number;

  @ApiProperty({
    description: 'Number of transactions skipped due to errors',
    example: 2,
  })
  skipped: number;

  @ApiProperty({
    description: 'Array of error messages for skipped transactions',
    example: ['Invalid date format on row 3', 'Missing amount on row 5'],
  })
  errors: string[];
}