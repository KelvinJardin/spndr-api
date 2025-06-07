import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HobbiesService } from './hobbies.service';
import { PaginatedResponseDto, PaginationQueryDto } from '../dto';
import { CreateHobbyDto, HobbyDto, HobbyStatsDto, UpdateHobbyDto } from './dto';
import { HobbyResponse, HobbyStatsResponse } from './types';

@ApiTags('Hobbies')
@Controller('users/:userId/hobbies')
export class HobbiesController {
  constructor(private readonly hobbiesService: HobbiesService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all hobbies for a user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<HobbyResponse> })
  async findAll(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<HobbyResponse>> {
    return this.hobbiesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hobby by ID' })
  @ApiResponse({ status: 200, type: HobbyDto })
  @ApiResponse({ status: 404, description: 'Hobby not found' })
  async findOne(@Param('userId') userId: string, @Param('id') id: string): Promise<HobbyResponse> {
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
  ): Promise<HobbyStatsResponse> {
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

  @Post()
  @ApiOperation({ summary: 'Create a new hobby' })
  @ApiResponse({ status: 201, type: HobbyDto })
  async create(
    @Param('userId') userId: string,
    @Body() createDto: CreateHobbyDto,
  ): Promise<HobbyResponse> {
    return this.hobbiesService.create(userId, createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hobby by ID' })
  @ApiResponse({ status: 200, type: HobbyDto })
  @ApiResponse({ status: 404, description: 'Hobby not found' })
  async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateHobbyDto,
  ): Promise<HobbyResponse> {
    const hobby = await this.hobbiesService.update(userId, id, updateDto);
    if (!hobby) {
      throw new NotFoundException(`Hobby with ID ${id} not found`);
    }
    return hobby;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hobby by ID' })
  @ApiResponse({ status: 204, description: 'Hobby deleted successfully' })
  @ApiResponse({ status: 404, description: 'Hobby not found' })
  async remove(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const deleted = await this.hobbiesService.remove(userId, id);
    if (!deleted) {
      throw new NotFoundException(`Hobby with ID ${id} not found`);
    }
  }
}