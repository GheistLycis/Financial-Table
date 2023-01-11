import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from '../year/Year';
import { MonthController } from './controller/month.controller';
import { Month } from './Month';
import { MonthService } from './service/month.service';

@Module({
  imports: [TypeOrmModule.forFeature([Month, Year])],
  controllers: [MonthController],
  providers: [MonthService],
})
export class MonthModule {}
