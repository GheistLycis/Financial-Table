import { Body, Controller, Injectable, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
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
  async duplicate(@Req() req, @Param('id', ParseIntPipe) id: MonthDTO['id'], @Body() body): Promise<GlobalResponse> {
    return await this.service.duplicate(req['user'].id, id, body).then(data => ({ data }))
  }
}
