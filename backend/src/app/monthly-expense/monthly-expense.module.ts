import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from '../month/Month';
import { MonthlyExpenseController } from './controller/monthly-expense.controller';
import { MonthlyExpense } from './MonthlyExpense';
import { MonthlyExpenseService } from './service/monthly-expense.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyExpense, Month])],
  controllers: [MonthlyExpenseController],
  providers: [MonthlyExpenseService],
  exports: [MonthlyExpenseService]
})
export class MonthlyExpenseModule {}
