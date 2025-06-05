import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { IntuitParserService } from './parsers/intuit-parser.service';
import { ParserFactory } from './parsers/parser.factory';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    IntuitParserService,
    ParserFactory,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {
}
