import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { HobbiesModule } from './modules/hobbies/hobbies.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TaxYearsModule } from './modules/tax-years/tax-years.module';
import { TransactionCategoriesModule } from './modules/transaction-categories/transaction-categories.module';
import { StatsService } from './services/stats.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    HobbiesModule,
    TransactionsModule,
    TaxYearsModule,
    TransactionCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, StatsService],
})
export class AppModule {}
