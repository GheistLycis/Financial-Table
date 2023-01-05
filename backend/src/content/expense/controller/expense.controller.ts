import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/BaseController';
import { ExpenseService } from '../service/expense.service';

@ApiTags('expenses')
@Injectable()
@Controller('expenses')
export class ExpenseController extends BaseController {
  constructor(service: ExpenseService) { 
    super(service) 
  }
}
