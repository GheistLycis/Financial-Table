import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from '../year/Year';
import { MonthController } from './controller/month.controller';
import { Month } from './Month';
import { MonthService } from './service/month.service';
import { MonthlyIncome } from '../monthly-income/MonthlyIncome';
import { MonthlyExpense } from '../monthly-expense/MonthlyExpense';
import { Category } from '../category/Category';
import { Group } from '../group/Group';
import { Expense } from '../expense/Expense';
import { YearService } from '../year/service/year.service';
import { MonthlyIncomeService } from '../monthly-income/service/monthly-income.service';
import { MonthlyExpenseService } from '../monthly-expense/service/monthly-expense.service';
import { CategoryService } from '../category/service/category.service';
import { GroupService } from '../group/service/group.service';
import { ExpenseService } from '../expense/service/expense.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Year,
      Month, 
      MonthlyIncome,
      MonthlyExpense,
      Category,
      Group,
      Expense,
    ]),
  ],
  controllers: [MonthController],
  providers: [
    YearService,
    MonthService, 
    MonthlyIncomeService,
    MonthlyExpenseService,
    CategoryService,
    GroupService,
    ExpenseService,
  ],
})
export class MonthModule {}
