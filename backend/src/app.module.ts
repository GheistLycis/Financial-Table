import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YearController } from './controllers/year/year.controller';
import { YearService } from './services/year/year.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    YearController,
  ],
  providers: [
    AppService,
    YearService,
  ],
})
export class AppModule {}
