import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearController } from './controller/year.controller';
import { YearService } from './service/year.service';
import { Year } from './Year';
import { User } from '../user/User';

@Module({
  imports: [TypeOrmModule.forFeature([Year, User])],
  controllers: [YearController],
  providers: [YearService],
  exports: [YearService]
})
export class YearModule {}
