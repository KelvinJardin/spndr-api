import { ApiProperty } from '@nestjs/swagger';
import { AveragesDto, MonthlyStatsDto, PeaksDto } from '../../../dto';

export class UserStatsDto {
  @ApiProperty({ type: [MonthlyStatsDto], required: false })
  monthlyStats?: MonthlyStatsDto[];

  @ApiProperty({ required: false })
  averages?: AveragesDto;

  @ApiProperty({ required: false })
  peaks?: PeaksDto;
}