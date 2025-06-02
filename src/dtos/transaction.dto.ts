import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsDate, IsOptional } from 'class-validator';
import { TransactionResponse, TransactionType } from '../types/transaction.type';

export class TransactionDto implements TransactionResponse {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty({ example: 'Website Development' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'INV-2024-001', required: false })
  @IsString()
  @IsOptional()
  reference: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes: string | null;

  @ApiProperty({ example: 'cln1234567890' })
  userId: string;

  @ApiProperty({ example: 'cln1234567890', required: false })
  hobbyId: string | null;

  @ApiProperty({ example: 'cln1234567890' })
  categoryId: string;

  @ApiProperty({ example: 'cln1234567890' })
  taxYearId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}