import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StatsService } from '../../services/stats.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, StatsService],
  exports: [UsersService],
})
export class UsersModule {
}
