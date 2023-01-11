import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/Category';
import { GroupController } from './controller/group.controller';
import { Group } from './Group';
import { GroupService } from './service/group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Category])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
