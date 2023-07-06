import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './controller/tag.controller';
import { Tag } from './Tag';
import { TagService } from './service/tag.service';
import { Expense } from '../expense/Expense';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Expense])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
