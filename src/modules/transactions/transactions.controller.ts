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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionDto, UpdateTransactionDto, TransactionFilterOptionsDto, TransactionFiltersDto } from './dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../dto';
import { TransactionResponse } from './types';
import { ValidationErrorDto } from '../../dto';

@ApiTags('Transactions')
@Controller('users/:userId/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<TransactionDto> })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'hobbyId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Date from (YYYY-MM-DD)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Date to (YYYY-MM-DD)' })
  @ApiQuery({ name: 'amountFrom', required: false, type: Number })
  @ApiQuery({ name: 'amountTo', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search in description' })
  async findAll(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
    @Query(new ValidationPipe({ transform: true })) filters: TransactionFiltersDto,
  ): Promise<PaginatedResponseDto<TransactionResponse>> {
    return this.transactionsService.findAll(userId, query, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, type: TransactionDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('userId') userId: string, @Param('id') id: string): Promise<TransactionResponse> {
    const transaction = await this.transactionsService.findOne(userId, id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  @Get('/filter-options')
  @ApiOperation({ summary: 'Get available filter options for transactions' })
  @ApiResponse({ status: 200, type: TransactionFilterOptionsDto })
  async getFilterOptions(
    @Param('userId') userId: string,
  ): Promise<TransactionFilterOptionsDto> {
    return this.transactionsService.getFilterOptions(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, type: TransactionDto })
  @ApiResponse({ status: 400, type: ValidationErrorDto })
  async create(
    @Param('userId') userId: string,
    @Body() createDto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    return this.transactionsService.create(userId, createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction by ID' })
  @ApiResponse({ status: 200, type: TransactionDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    const transaction = await this.transactionsService.update(userId, id, updateDto);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction by ID' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const deleted = await this.transactionsService.remove(userId, id);
    if (!deleted) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}