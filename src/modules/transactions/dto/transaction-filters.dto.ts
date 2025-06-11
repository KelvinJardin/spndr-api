import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class TransactionFiltersDto {
  @ApiProperty({ 
    enum: TransactionType, 
    required: false,
    description: 'Filter by transaction type'
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ 
    required: false,
    description: 'Filter by hobby ID'
  })
  @IsOptional()
  @IsString()
  hobbyId?: string;

  @ApiProperty({ 
    required: false,
    description: 'Filter by category ID'
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ 
    required: false,
    description: 'Filter by date from (YYYY-MM-DD)'
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ 
    required: false,
    description: 'Filter by date to (YYYY-MM-DD)'
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ 
    required: false,
    description: 'Filter by minimum amount'
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  amountFrom?: number;

  @ApiProperty({ 
    required: false,
    description: 'Filter by maximum amount'
  })
  @IsOptional()
  @Type(() => Number)
  @IsDecimal()
  amountTo?: number;

  @ApiProperty({ 
    required: false,
    description: 'Search in transaction description'
  })
  @IsOptional()
  @IsString()
  search?: string;
}