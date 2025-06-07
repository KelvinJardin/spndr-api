import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHobbyDto {
  @ApiProperty({ example: 'Photography' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Wedding and event photography', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}