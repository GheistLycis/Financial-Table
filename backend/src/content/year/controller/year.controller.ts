import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/BaseController';
import { YearService } from '../service/year.service';

@ApiTags('years')
@Injectable()
@Controller('years')
export class YearController extends BaseController {
  constructor(service: YearService) { 
    super(service) 
  }
}
