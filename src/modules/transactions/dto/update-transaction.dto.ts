import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class UpdateTransactionDto {
  @ApiProperty({ enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({ example: '199.99', description: 'Transaction amount', required: false })
  @IsDecimal()
  @IsOptional()
  @Transform(({ value }) => value ? new Decimal(value) : undefined)
  amount?: Decimal;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'Website Development', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'INV-2024-001', required: false })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'cln1234567890', required: false })
  @IsString()
  @IsOptional()
  hobbyId?: string;

  @ApiProperty({ example: 'cln1234567890', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'cln1234567890', required: false })
  @IsString()
  @IsOptional()
  bankAccountId?: string;
}