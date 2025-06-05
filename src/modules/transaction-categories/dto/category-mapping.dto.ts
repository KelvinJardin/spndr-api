import { ApiProperty } from '@nestjs/swagger';
import { Sa103fBox } from '@prisma/client';

export class CategoryMappingDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 'cln1234567890' })
  categoryId: string;

  @ApiProperty({ example: 'cln1234567890' })
  taxYearId: string;

  @ApiProperty({ enum: Sa103fBox })
  sa103fBox: Sa103fBox;

  @ApiProperty({ example: true })
  allowable: boolean;

  @ApiProperty({ example: 'Additional notes about tax treatment', required: false })
  notes: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}