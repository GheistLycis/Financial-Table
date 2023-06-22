import { Controller, Get, Injectable, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { ExpenseService } from '../service/expense.service';
import { handleException, handleResponse } from 'src/shared/functions/GlobalHandlers';
import GlobalException from 'src/shared/interfaces/GlobalException';

@ApiTags('expenses')
@Injectable()
@Controller('expenses')
export class ExpenseController extends BaseController {
  constructor(service: ExpenseService) { 
    super(service) 
  }
  
  @Get() async list(@Req() req, @Query() query, @Res() res) {
    return await this.service.list(query, req)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
