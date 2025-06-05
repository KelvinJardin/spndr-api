import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Sa103fBox } from '@prisma/client';

export class CreateCategoryMappingDto {
  @ApiProperty({ enum: Sa103fBox })
  @IsEnum(Sa103fBox)
  sa103fBox: Sa103fBox;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowable: boolean;

  @ApiProperty({ example: 'Additional notes about tax treatment', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}