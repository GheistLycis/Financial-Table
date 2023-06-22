import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { MonthlyEntryService } from '../service/monthly-entry.service';

@ApiTags('monthly-entries')
@Injectable()
@Controller('monthly-entries')
export class MonthlyEntryController extends BaseController {
  constructor(service: MonthlyEntryService) { 
    super(service) 
  }
}
