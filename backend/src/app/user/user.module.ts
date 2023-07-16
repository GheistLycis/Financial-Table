import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User } from './User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Saving } from '../saving/Saving';
import { Year } from '../year/Year';
import { Month } from '../month/Month';
import { MonthlyIncome } from '../monthly-income/MonthlyIncome';
import { MonthlyExpense } from '../monthly-expense/MonthlyExpense';
import { Category } from '../category/Category';
import { Expense } from '../expense/Expense';
import { Tag } from '../tag/Tag';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Saving,
      Year,
      Month,
      MonthlyIncome,
      MonthlyExpense,
      Category,
      Expense,
      Tag,
    ]), 
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
