import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from '../month/Month';
import { MonthlyIncomeController } from './controller/monthly-income.controller';
import { MonthlyIncome } from './MonthlyIncome';
import { MonthlyIncomeService } from './service/monthly-income.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyIncome, Month])],
  controllers: [MonthlyIncomeController],
  providers: [MonthlyIncomeService],
})
export class MonthlyIncomeModule {}
