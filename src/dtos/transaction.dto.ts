import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '../types/transaction.type';
import { PaginatedResponseDto } from './pagination.dto';

export class TransactionDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ example: '199.99', type: String })
  amount: Decimal;

  @ApiProperty()
  date: Date;

  @ApiProperty({ example: 'Website Development' })
  description: string;

  @ApiProperty({ example: 'INV-2024-001', required: false })
  reference: string | null;

  @ApiProperty({ required: false })
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
