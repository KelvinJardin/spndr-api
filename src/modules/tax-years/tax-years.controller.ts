import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxYearsService } from './tax-years.service';
import { PaginatedResponseDto, PaginationQueryDto, TaxYearDto } from '../../dtos';
import { TaxYearStatsDto } from '../../dtos/tax-year-stats.dto';

@ApiTags('Tax Years')
@Controller('tax-years')
export class TaxYearsController {
  constructor(private readonly taxYearsService: TaxYearsService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all tax years' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<TaxYearDto> })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto) {
    return this.taxYearsService.findAll(query);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tax year' })
  @ApiResponse({ status: 200, type: TaxYearDto })
  @ApiResponse({ status: 404, description: 'Current tax year not found' })
  async findCurrent() {
    const taxYear = await this.taxYearsService.findCurrent();
    if (!taxYear) {
      throw new NotFoundException('Current tax year not found');
    }
    return taxYear;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tax year by ID' })
  @ApiResponse({ status: 200, type: TaxYearDto })
  @ApiResponse({ status: 404, description: 'Tax year not found' })
  async findOne(@Param('id') id: string) {
    const taxYear = await this.taxYearsService.findOne(id);
    if (!taxYear) {
      throw new NotFoundException(`Tax year with ID ${id} not found`);
    }
    return taxYear;
  }

  @Get(':id/stats/:userId')
  @ApiOperation({ summary: 'Get tax year statistics for a user' })
  @ApiResponse({ status: 200, type: TaxYearStatsDto })
  @ApiResponse({ status: 404, description: 'Tax year not found' })
  async getStats(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const taxYear = await this.taxYearsService.findOne(id);
    if (!taxYear) {
      throw new NotFoundException(`Tax year with ID ${id} not found`);
    }
    return this.taxYearsService.getTaxYearStats(id, userId);
  }
}
