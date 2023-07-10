import { Controller, Get, Injectable, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { ExpenseService } from '../service/expense.service';

@ApiTags('expenses')
@Injectable()
@Controller('expenses')
export class ExpenseController extends BaseController {
  constructor(service: ExpenseService) { 
    super(service) 
  }
  
  @Get() 
  async list(@Query() query, @Req() req) {
    query.tags = query.tags?.length
      ? query.tags.split(',')
      : []
    
    return await this.service.list(query, req['user'].id).then(data => ({ data }))
  }
}
