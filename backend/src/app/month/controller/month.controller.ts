import { Body, Controller, Injectable, Param, Post, Req, Res, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { MonthService } from '../service/month.service';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import GlobalException from 'src/shared/interfaces/GlobalException';

@ApiTags('months')
@Injectable()
@Controller('months')
export class MonthController extends BaseController {
  constructor(service: MonthService) { 
    super(service) 
  }
  
  @Post('duplicate/:id') 
  async duplicate(@Req() req, @Param('id') id, @Body() body, @Res() res) {
    return await this.service.duplicate(id, body)
      .then(data => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
