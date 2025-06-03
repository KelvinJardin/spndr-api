import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 0, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @ApiProperty({ required: false, minimum: 1, maximum: 100, default: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 50;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  readonly meta: {
    total: number;
    offset: number;
  };
}