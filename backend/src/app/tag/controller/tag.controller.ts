import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { TagService } from '../service/tag.service';

@ApiTags('tags')
@Injectable()
@Controller('tags')
export class TagController extends BaseController {
  constructor(service: TagService) { 
    super(service) 
  }
}
