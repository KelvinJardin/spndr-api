import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateHobbyDto {
  @ApiProperty({ example: 'Photography', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Wedding and event photography', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}