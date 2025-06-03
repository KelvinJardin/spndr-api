import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from "./pagination.dto";

export class TaxYearDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 2024 })
  startYear: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ example: true })
  isCurrent: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
