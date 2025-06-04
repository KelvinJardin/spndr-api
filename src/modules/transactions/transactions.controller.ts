import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from '../../dtos/transaction.dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../../dtos';
import { ImportTransactionDto, ImportTransactionResponseDto } from '../../dtos/import-transaction.dto';
import { Post, Body } from '@nestjs/common';

@ApiTags('Transactions')
@Controller('users/:userId/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {
  }

  @Post('import/csv')
  @ApiOperation({ summary: 'Import transactions from CSV' })
  @ApiResponse({ status: 200, type: ImportTransactionResponseDto })
  @ApiBody({ type: ImportTransactionDto })
  async importCsv(
    @Param('userId') userId: string,
    @Body() importDto: ImportTransactionDto,
  ) {
    return this.transactionsService.importCsv(userId, importDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<TransactionDto> })
  @ApiQuery({ name: 'hobbyId', required: false })
  async findAll(
    @Param('userId') userId: string,
    @Query(new ValidationPipe({ transform: true })) query: PaginationQueryDto,
    @Query('hobbyId') hobbyId?: string,
  ) {
    return this.transactionsService.findAll(userId, query, hobbyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, type: TransactionDto })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('userId') userId: string, @Param('id') id: string) {
    const transaction = await this.transactionsService.findOne(userId, id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}