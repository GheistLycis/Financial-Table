import { Module } from '@nestjs/common';
import { MonthController } from './controller/month.controller';
import { MonthService } from './service/month.service';

@Module({
  imports: [],
  controllers: [MonthController],
  providers: [MonthService],
})
export class MonthModule {}
