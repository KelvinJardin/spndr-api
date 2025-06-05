import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sales' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sales/turnover', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}