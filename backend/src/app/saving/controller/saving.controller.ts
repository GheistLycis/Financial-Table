import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { SavingService } from '../service/saving.service';

@ApiTags('savings')
@Injectable()
@Controller('savings')
export class SavingController extends BaseController {
  constructor(service: SavingService) { 
    super(service) 
  }
}
