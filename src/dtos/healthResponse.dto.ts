import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Current health status of the application',
    example: 'healthy',
  })
  status: string;

  @ApiProperty({
    description: 'Application version',
    example: '1.0.0',
  })
  version: string;
}
