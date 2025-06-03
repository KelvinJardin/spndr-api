import { ApiProperty } from '@nestjs/swagger';

export class HobbyDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 'Photography' })
  name: string;

  @ApiProperty({ example: 'Wedding and event photography', required: false })
  description: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'cln1234567890' })
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 5, description: 'Number of transactions associated with this hobby' })
  transactionCount: number;
}
