import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'cln1234567890' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string | null;

  @ApiProperty({ example: 'john@example.com' })
  email: string | null;

  @ApiProperty({ example: 'user' })
  type: string;

  @ApiProperty({ example: 'email' })
  provider: string;

  @ApiProperty({ example: 'john@example.com' })
  providerAccountId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
