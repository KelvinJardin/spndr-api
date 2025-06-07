import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum ImportType {
  INTUIT = 'Intuit',
}

export class ImportTransactionDto {
  @ApiProperty({
    enum: ImportType,
    description: 'Type of import parser to use',
    example: 'Intuit',
  })
  @IsEnum(ImportType)
  type: ImportType;

  @ApiProperty({
    description: 'Optional hobby ID to associate transactions with',
    example: 'cln1234567890',
    required: false,
  })
  @IsString()
  hobbyId: string;

  @ApiProperty({
    description: 'Array of transaction data to import',
    example: [
      {
        Date: '2024-01-01',
        Description: 'Test Transaction',
        Amount: '100.00',
        Category: 'Income',
        Notes: 'Test note',
      },
    ],
  })
  @IsArray()
  @IsObject({ each: true })
  data: Record<string, string>[];
}

export class ImportTransactionResponseDto {
  @ApiProperty({
    description: 'Number of transactions successfully imported',
    example: 10,
  })
  imported: number;

  @ApiProperty({
    description: 'Array of error messages for skipped transactions',
    example: ['Invalid date format on row 3', 'Missing amount on row 5'],
  })
  @IsOptional()
  errors?: { row: number, error: string }[];

  @ApiProperty({
    description: 'Error message if any',
    example: 'Failed to import transactions',
  })
  @IsOptional()
  error?: string;
}