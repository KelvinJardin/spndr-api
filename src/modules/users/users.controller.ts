import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from '../../dtos/user.dto';
import { UserStatsDto } from '../../dtos/user-stats.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDto] })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user transaction statistics' })
  @ApiResponse({ status: 200, type: UserStatsDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'months', required: false, type: Number })
  @ApiQuery({ name: 'includeMonthlyStats', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAverages', required: false, type: Boolean })
  @ApiQuery({ name: 'includePeaks', required: false, type: Boolean })
  async getStats(
    @Param('id') id: string,
    @Query('months') months?: number,
    @Query('includeMonthlyStats') includeMonthlyStats?: boolean,
    @Query('includeAverages') includeAverages?: boolean,
    @Query('includePeaks') includePeaks?: boolean,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.usersService.getUserStats(id, {
      months: months ? Number(months) : undefined,
      includeMonthlyStats,
      includeAverages,
      includePeaks,
    });
  }
}
