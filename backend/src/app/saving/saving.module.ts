import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './Saving';
import { SavingController } from './controller/saving.controller';
import { SavingService } from './service/saving.service';
import { User } from '../user/User';

@Module({
  imports: [TypeOrmModule.forFeature([Saving, User])],
  controllers: [SavingController],
  providers: [SavingService],
})
export class SavingModule {}
