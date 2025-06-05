import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionCategoriesService } from './transaction-categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryDto, CategoryMappingDto, CreateCategoryMappingDto, UpdateCategoryMappingDto } from './dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../../dtos';

@ApiTags('Transaction Categories')
@Controller('transaction-categories')
export class TransactionCategoriesController {
  constructor(private readonly service: TransactionCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transaction categories' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  async findAll(@Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto): Promise<PaginatedResponseDto<CategoryDto>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction category by ID' })
  @ApiResponse({ status: 200, type: CategoryDto })
  async findOne(@Param('id') id: string): Promise<CategoryDto> {
    const category = await this.service.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Post()
  @ApiOperation({ summary: 'Create transaction category' })
  @ApiResponse({ status: 201, type: CategoryDto })
  async create(@Body() createDto: CreateCategoryDto): Promise<CategoryDto> {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction category' })
  @ApiResponse({ status: 200, type: CategoryDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.service.update(id, updateDto);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction category' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  @Get(':id/tax-years/:taxYearId')
  @ApiOperation({ summary: 'Get category mapping for tax year' })
  @ApiResponse({ status: 200, type: CategoryMappingDto })
  async findMapping(@Param('id') id: string, @Param('taxYearId') taxYearId: string): Promise<CategoryMappingDto> {
    const mapping = await this.service.findMapping(id, taxYearId);
    if (!mapping) {
      throw new NotFoundException(`Mapping not found for category ${id} and tax year ${taxYearId}`);
    }
    return mapping;
  }

  @Post(':id/tax-years/:taxYearId')
  @ApiOperation({ summary: 'Create category mapping for tax year' })
  @ApiResponse({ status: 201, type: CategoryMappingDto })
  async createMapping(
    @Param('id') id: string,
    @Param('taxYearId') taxYearId: string,
    @Body() createDto: CreateCategoryMappingDto,
  ): Promise<CategoryMappingDto> {
    return this.service.createMapping(id, taxYearId, createDto);
  }

  @Patch(':id/tax-years/:taxYearId')
  @ApiOperation({ summary: 'Update category mapping for tax year' })
  @ApiResponse({ status: 200, type: CategoryMappingDto })
  async updateMapping(
    @Param('id') id: string,
    @Param('taxYearId') taxYearId: string,
    @Body() updateDto: UpdateCategoryMappingDto,
  ): Promise<CategoryMappingDto> {
    const mapping = await this.service.updateMapping(id, taxYearId, updateDto);
    if (!mapping) {
      throw new NotFoundException(`Mapping not found for category ${id} and tax year ${taxYearId}`);
    }
    return mapping;
  }

  @Delete(':id/tax-years/:taxYearId')
  @ApiOperation({ summary: 'Delete category mapping for tax year' })
  @ApiResponse({ status: 204 })
  async removeMapping(@Param('id') id: string, @Param('taxYearId') taxYearId: string): Promise<void> {
    const deleted = await this.service.removeMapping(id, taxYearId);
    if (!deleted) {
      throw new NotFoundException(`Mapping not found for category ${id} and tax year ${taxYearId}`);
    }
  }
}