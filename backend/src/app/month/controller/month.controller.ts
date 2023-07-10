import { Body, Controller, Injectable, Param, ParseIntPipe, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { MonthService } from '../service/month.service';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';
import MonthDTO from '../Month.dto';

@ApiTags('months')
@Injectable()
@Controller('months')
export class MonthController extends BaseController {
  constructor(service: MonthService) { 
    super(service) 
  }
  
  @Post('duplicate/:id') 
  async duplicate(@Param('id', ParseIntPipe) id: MonthDTO['id'], @Body() body): Promise<GlobalResponse> {
    return await this.service.duplicate(id, body).then(data => ({ data }))
  }
}
