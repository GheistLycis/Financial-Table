import { Module } from '@nestjs/common';
import { YearController } from './controller/year.controller';
import { YearService } from './service/year.service';

@Module({
  imports: [],
  controllers: [YearController],
  providers: [YearService],
})
export class YearModule {}
