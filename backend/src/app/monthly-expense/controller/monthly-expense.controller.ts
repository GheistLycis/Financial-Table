import { Controller, Get, Injectable, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from '@classes/BaseController';
import { MonthlyExpenseService } from '../service/monthly-expense.service';

@ApiTags('monthly-expenses')
@Injectable()
@Controller('monthly-expenses')
export class MonthlyExpenseController extends BaseController {
  constructor(service: MonthlyExpenseService) { 
    super(service) 
  }
  
  @Get('up-next')
  async upNext(@Req() req) {
    return await this.service.upNext(req['user'].id).then(data => ({ data }))
  }
}