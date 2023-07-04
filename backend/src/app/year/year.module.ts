import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YearController } from './controller/year.controller';
import { YearService } from './service/year.service';
import { Year } from './Year';

@Module({
  imports: [TypeOrmModule.forFeature([Year])],
  controllers: [YearController],
  providers: [YearService],
  exports: [YearService]
})
export class YearModule {}
