import { ApiProperty } from '@nestjs/swagger';
import {PaginatedResponseDto} from "./pagination.dto";

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

  @ApiProperty({
    example: { count: 5 },
    description: 'Transaction information for this hobby',
  })
  transactions: {
    count: number;
  };
}
