import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Sa103fBox } from '@prisma/client';

export class UpdateCategoryMappingDto {
  @ApiProperty({ enum: Sa103fBox, required: false })
  @IsEnum(Sa103fBox)
  @IsOptional()
  sa103fBox?: Sa103fBox;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  allowable?: boolean;

  @ApiProperty({ example: 'Additional notes about tax treatment', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}