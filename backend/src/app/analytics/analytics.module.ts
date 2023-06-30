import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './controller/analytics.controller';
import { AnalyticsService } from './service/analytics.service';
import { Year } from '../year/Year';
import { Category } from '../category/Category';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Year,
      Category,
    ])
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
