import { Module } from '@nestjs/common';
import { TaxYearsController } from './tax-years.controller';
import { TaxYearsService } from './tax-years.service';

@Module({
  controllers: [TaxYearsController],
  providers: [TaxYearsService],
  exports: [TaxYearsService],
})
export class TaxYearsModule {}