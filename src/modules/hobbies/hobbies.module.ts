import { Module } from '@nestjs/common';
import { HobbiesController } from './hobbies.controller';
import { HobbiesService } from './hobbies.service';
import { StatsService } from '../../services/stats.service';

@Module({
  controllers: [HobbiesController],
  providers: [HobbiesService, StatsService],
  exports: [HobbiesService],
})
export class HobbiesModule {
}
