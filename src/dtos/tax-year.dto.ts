import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';
import { TaxYearResponse } from '../types/tax-year.type';

export class TaxYearDto implements TaxYearResponse {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 2024 })
  @IsNumber()
  startYear: number;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCurrent: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}