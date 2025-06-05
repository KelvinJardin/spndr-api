import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CategoryDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 'Sales' })
  name: string;

  @ApiProperty({ example: 'Sales/turnover', required: false })
  description: string | null;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}