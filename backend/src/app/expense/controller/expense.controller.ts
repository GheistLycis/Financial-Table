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
  async list(@Req() req, @Query() query) {
    query.categories = query.categories?.length
      ? query.categories.split(',')
      : []

    query.months = query.months?.length
      ? query.months.split(',')
      : []

    query.tags = query.tags?.length
      ? query.tags.split(',')
      : []

    query.orderBy = query.orderBy?.length
      ? query.orderBy.split(',')
      : []
    
    return await this.service.list(req['user'].id, query).then(data => ({ data }))
  }
}
