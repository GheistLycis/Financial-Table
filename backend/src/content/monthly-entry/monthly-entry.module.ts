import { Module } from '@nestjs/common';
import { MonthlyEntryController } from './controller/monthly-entry.controller';
import { MonthlyEntryService } from './service/monthly-entry.service';

@Module({
  imports: [],
  controllers: [MonthlyEntryController],
  providers: [MonthlyEntryService],
})
export class MonthlyEntryModule {}
