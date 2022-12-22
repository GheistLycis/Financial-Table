import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YearController } from './controllers/year/year.controller';
import { YearService } from './services/year/year.service';
import { MonthController } from './controllers/month/month.controller';
import { MonthService } from './services/month/month.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    YearController,
    MonthController,
  ],
  providers: [
    AppService,
    YearService,
    MonthService,
  ],
})
export class AppModule {}
