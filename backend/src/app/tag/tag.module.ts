import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './controller/tag.controller';
import { Tag } from './Tag';
import { TagService } from './service/tag.service';
import { User } from '../user/User';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
