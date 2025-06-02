import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HobbiesService } from './hobbies.service';
import { HobbyDto } from '../../dtos/hobby.dto';

@ApiTags('Hobbies')
@Controller('users/:userId/hobbies')
export class HobbiesController {
  constructor(private readonly hobbiesService: HobbiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hobbies for a user' })
  @ApiResponse({ status: 200, type: [HobbyDto] })
  async findAll(@Param('userId') userId: string) {
    return this.hobbiesService.findAll(userId);
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
}