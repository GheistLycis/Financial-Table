import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/Group';
import { ExpenseController } from './controller/expense.controller';
import { Expense } from './Expense';
import { ExpenseService } from './service/expense.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Group])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
