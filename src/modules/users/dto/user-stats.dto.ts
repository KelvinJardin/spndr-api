import { ApiProperty } from "@nestjs/swagger";
import { MonthlyStatsDto, AveragesDto, PeaksDto } from "../../../dto";

export class UserStatsDto {
  @ApiProperty({ type: [MonthlyStatsDto], required: false })
  monthlyStats?: MonthlyStatsDto[];

  @ApiProperty({ required: false })
  averages?: AveragesDto;

  @ApiProperty({ required: false })
  peaks?: PeaksDto;
}