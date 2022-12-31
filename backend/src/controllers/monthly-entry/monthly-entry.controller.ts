import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/configs/BaseController';
import { MonthlyEntryService } from 'src/services/monthly-entry/monthly-entry.service';

@ApiTags('monthly-entries')
@Injectable()
@Controller('monthly-entries')
export class MonthlyEntryController extends BaseController {
  constructor(service: MonthlyEntryService) { 
    super(service) 
  }
}
