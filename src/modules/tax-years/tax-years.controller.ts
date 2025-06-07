import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxYearsService } from './tax-years.service';
import { PaginatedResponseDto, PaginationQueryDto } from '../dto';
import { TaxYearDto, TaxYearStatsDto } from './dto';
import { TaxYearResponse } from './types';
import { TaxYearStatsResponse } from './types/tax-year-stats.type';

@ApiTags('Tax Years')
@Controller('tax-years')
export class TaxYearsController {
  constructor(private readonly taxYearsService: TaxYearsService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all tax years' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<TaxYearDto> })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto): Promise<PaginatedResponseDto<TaxYearResponse>> {
    return this.taxYearsService.findAll(query);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tax year' })
  @ApiResponse({ status: 200, type: TaxYearDto })
  @ApiResponse({ status: 404, description: 'Current tax year not found' })
  async findCurrent(): Promise<TaxYearResponse> {
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
  async findOne(@Param('id') id: string): Promise<TaxYearResponse> {
    const taxYear = await this.taxYearsService.findOne(id);
    if (!taxYear) {
      throw new NotFoundException(`Tax year with ID ${id} not found`);
    }
    return taxYear;
  }

  @Get(':year/tax_report/:userId')
  @ApiOperation({ summary: 'Get tax year report for a user' })
  @ApiResponse({ status: 200, type: TaxYearStatsDto })
  @ApiResponse({ status: 404, description: 'Tax year not found' })
  async getTaxReport(
    @Param('year') year: string,
    @Param('userId') userId: string,
  ): Promise<TaxYearStatsResponse> {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      throw new NotFoundException('Invalid year format. Please provide a valid year (e.g., 2024)');
    }

    const taxYear = await this.taxYearsService.findByYear(parsedYear);
    if (!taxYear) {
      throw new NotFoundException(`Tax year ${parsedYear} not found`);
    }
    return this.taxYearsService.getTaxYearStats(taxYear.id, userId);
  }
}
