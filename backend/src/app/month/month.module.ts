import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from '../year/Year';
import { MonthController } from './controller/month.controller';
import { Month } from './Month';
import { MonthService } from './service/month.service';
import { YearModule } from '../year/year.module';
import { MonthlyIncomeModule } from '../monthly-income/monthly-income.module';
import { MonthlyExpenseModule } from '../monthly-expense/monthly-expense.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Year, Month]),
    YearModule,
    MonthlyIncomeModule,
    MonthlyExpenseModule,
    CategoryModule,
  ],
  controllers: [MonthController],
  providers: [MonthService],
})
export class MonthModule {}
