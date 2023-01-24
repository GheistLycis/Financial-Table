import { Controller, Get, Injectable, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/BaseController';
import { handleError, handleResponse } from 'src/utils/handlers';
import { YearService } from '../service/year.service';

@ApiTags('years')
@Injectable()
@Controller('years')
export class YearController extends BaseController {
  constructor(service: YearService) { 
    super(service) 
  }

  @Get('fetch-all') async fetchAll(@Query() query, @Res() res) {
    return await this.service.fetchAll(query)
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }
}
