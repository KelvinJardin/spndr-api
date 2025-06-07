import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../transactions.service';
import { ImportTransactionDto, ImportTransactionResponseDto } from '../dto';

@ApiTags('Transactions Import', 'Transactions')
@Controller('users/:userId/transactions/import')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {
  }

  @Post('csv')
  @ApiOperation({ summary: 'Import transactions from CSV' })
  @ApiResponse({ status: 200, type: ImportTransactionResponseDto })
  @ApiBody({ type: ImportTransactionDto })
  async importCsv(
    @Param('userId') userId: string,
    @Body() importDto: ImportTransactionDto,
  ): Promise<ImportTransactionResponseDto> {
    return this.transactionsService.importCsv(userId, importDto);
  }
}