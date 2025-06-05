import { Body, Controller, Get, NotFoundException, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { ImportTransactionDto, ImportTransactionResponseDto, TransactionDto } from './dto';
import { PaginatedResponseDto, PaginationQueryDto } from '../dto';

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
  ): Promise<ImportTransactionResponseDto> {
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
  ): Promise<PaginatedResponseDto<TransactionResponse>> {
    return this.transactionsService.findAll(userId, query, hobbyId);
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
}