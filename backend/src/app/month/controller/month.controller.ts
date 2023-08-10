import { Body, Controller, Get, Injectable, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from '@classes/BaseController';
import { MonthService } from '../service/month.service';
import GlobalResponse from '@interfaces/GlobalResponse';
import MonthDTO from '../Month.dto';

@ApiTags('months')
@Injectable()
@Controller('months')
export class MonthController extends BaseController {
  constructor(service: MonthService) { 
    super(service)
  }
  
  @Post('duplicate/:id') 
  async duplicate(@Req() req, @Param('id', ParseIntPipe) id: MonthDTO['id'], @Body() body): Promise<GlobalResponse> {
    return await this.service.duplicate(req['user'].id, id, body).then(data => ({ data }))
  }

  @Get('get-csv')
  async getCSV(@Req() req) {
    return await this.service.getCSV(req['user'].id).then(data => ({ data }))
  }
}
