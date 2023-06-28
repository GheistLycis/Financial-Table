import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { MonthlyIncomeService } from '../service/monthly-income.service';

@ApiTags('monthly-incomes')
@Injectable()
@Controller('monthly-incomes')
export class MonthlyIncomeController extends BaseController {
  constructor(service: MonthlyIncomeService) { 
    super(service) 
  }
}
