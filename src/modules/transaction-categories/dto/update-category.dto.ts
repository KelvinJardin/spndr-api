import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Sales', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Sales/turnover', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}