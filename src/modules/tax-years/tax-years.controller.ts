import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxYearsService } from './tax-years.service';
import { TaxYearDto } from '../../dtos/tax-year.dto';

@ApiTags('Tax Years')
@Controller('tax-years')
export class TaxYearsController {
  constructor(private readonly taxYearsService: TaxYearsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tax years' })
  @ApiResponse({ status: 200, type: [TaxYearDto] })
  async findAll() {
    return this.taxYearsService.findAll();
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
}