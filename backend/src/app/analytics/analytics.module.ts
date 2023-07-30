import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './controller/analytics.controller';
import { AnalyticsService } from './service/analytics.service';
import { Year } from '../year/Year';
import { Category } from '../category/Category';
import { Month } from '../month/Month';
import { Tag } from '../tag/Tag';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Month,
      Year,
      Tag
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
