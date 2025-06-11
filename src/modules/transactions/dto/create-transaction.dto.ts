import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsDecimal, IsOptional, IsString } from "class-validator";
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '199.99', description: 'Transaction amount' })
  @IsDecimal()
  amount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Website Development' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'INV-2024-001', required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'cln1234567890', required: true })
  @IsString()
  hobbyId: string;

  @ApiProperty({ example: 'cln1234567890' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'cln1234567890', required: false })
  @IsString()
  @IsOptional()
  bankAccountId?: string;
}