import { Module } from '@nestjs/common';
import { ExpenseController } from './controller/expense.controller';
import { ExpenseService } from './service/expense.service';

@Module({
  imports: [],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
