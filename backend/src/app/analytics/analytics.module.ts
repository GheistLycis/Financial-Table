import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './controller/analytics.controller';
import { AnalyticsService } from './service/analytics.service';
import { Year } from '../year/Year';
import { Category } from '../category/Category';
import { Month } from '../month/Month';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Month,
      Year,
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
