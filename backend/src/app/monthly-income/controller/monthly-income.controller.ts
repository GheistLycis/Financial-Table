import { Controller, Get, Injectable, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from '@classes/BaseController';
import { MonthlyIncomeService } from '../service/monthly-income.service';

@ApiTags('monthly-incomes')
@Injectable()
@Controller('monthly-incomes')
export class MonthlyIncomeController extends BaseController {
  constructor(service: MonthlyIncomeService) { 
    super(service) 
  }
  
  @Get('up-next')
  async upNext(@Req() req) {
    return await this.service.upNext(req['user'].id).then(data => ({ data }))
  }
}
