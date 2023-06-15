import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from '../month/Month';
import { MonthlyEntryController } from './controller/monthly-entry.controller';
import { MonthlyEntry } from './MonthlyEntry';
import { MonthlyEntryService } from './service/monthly-entry.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyEntry, Month])],
  controllers: [MonthlyEntryController],
  providers: [MonthlyEntryService],
})
export class MonthlyEntryModule {}
