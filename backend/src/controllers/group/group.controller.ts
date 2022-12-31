import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/configs/BaseController';
import { GroupService } from 'src/services/group/group.service';

@ApiTags('groups')
@Injectable()
@Controller('groups')
export class GroupController extends BaseController {
  constructor(service: GroupService) { 
    super(service) 
  }
}
