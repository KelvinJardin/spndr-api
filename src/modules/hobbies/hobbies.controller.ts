import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HobbiesService } from './hobbies.service';
import { HobbyDto, HobbyStatsDto, PaginatedHobbyResponseDto, PaginationQueryDto } from '../../dtos';

@ApiTags('Hobbies')
@Controller('users/:userId/hobbies')
export class HobbiesController {
  constructor(private readonly hobbiesService: HobbiesService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all hobbies for a user' })
  @ApiResponse({ status: 200, type: PaginatedHobbyResponseDto })
  async findAll(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ) {
    return this.hobbiesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hobby by ID' })
  @ApiResponse({ status: 200, type: HobbyDto })
  @ApiResponse({ status: 404, description: 'Hobby not found' })
  async findOne(@Param('userId') userId: string, @Param('id') id: string) {
    const hobby = await this.hobbiesService.findOne(userId, id);
    if (!hobby) {
      throw new NotFoundException(`Hobby with ID ${id} not found`);
    }
    return hobby;
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get hobby transaction statistics' })
  @ApiResponse({ status: 200, type: HobbyStatsDto })
  @ApiResponse({ status: 404, description: 'Hobby not found' })
  @ApiQuery({ name: 'months', required: false, type: Number })
  @ApiQuery({ name: 'includeMonthlyStats', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAverages', required: false, type: Boolean })
  @ApiQuery({ name: 'includePeaks', required: false, type: Boolean })
  async getStats(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Query('months') months?: number,
    @Query('includeMonthlyStats') includeMonthlyStats?: boolean,
    @Query('includeAverages') includeAverages?: boolean,
    @Query('includePeaks') includePeaks?: boolean,
  ) {
    const hobby = await this.hobbiesService.findOne(userId, id);
    if (!hobby) {
      throw new NotFoundException(`Hobby with ID ${id} not found`);
    }

    return this.hobbiesService.getHobbyStats(userId, id, {
      months: months ? Number(months) : undefined,
      includeMonthlyStats,
      includeAverages,
      includePeaks,
    });
  }
}