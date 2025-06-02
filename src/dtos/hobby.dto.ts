import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { HobbyResponse } from '../types/hobby.type';

export class HobbyDto implements HobbyResponse {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 'Photography' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Wedding and event photography', required: false })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'cln1234567890' })
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}