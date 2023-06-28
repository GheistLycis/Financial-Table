import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './controller/analytics.controller';
import { AnalyticsService } from './service/analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature()
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
