import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { GroupService } from './service/group.service';

@Module({
  imports: [],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
