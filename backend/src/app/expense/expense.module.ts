import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './controller/expense.controller';
import { Expense } from './Expense';
import { ExpenseService } from './service/expense.service';
import { Category } from '../category/Category';
import { Tag } from '../tag/Tag';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category, Tag])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
