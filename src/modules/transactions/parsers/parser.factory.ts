import { Injectable } from '@nestjs/common';
import { TransactionParser } from './parser.interface';
import { IntuitParserService } from './intuit-parser.service';
import { ImportType } from '../../../dtos/import-transaction.dto';

@Injectable()
export class ParserFactory {
  constructor(private readonly intuitParser: IntuitParserService) {}

  getParser(type: ImportType): TransactionParser {
    switch (type) {
      case ImportType.INTUIT:
        return this.intuitParser;
      default:
        throw new Error(`Unsupported parser type: ${type}`);
    }
  }
}