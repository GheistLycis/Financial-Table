import { Controller, Get, Injectable, Req, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/shared/BaseController';
import { handleException, handleResponse } from 'src/shared/globalHandlers';
import { YearService } from '../service/year.service';
import { GlobalException } from 'src/shared/GlobalException';

@ApiTags('years')
@Injectable()
@Controller('years')
export class YearController extends BaseController {
  constructor(service: YearService) { 
    super(service) 
  }

  @Get('fetch-all') async fetchAll(@Req() req, @Query() query, @Res() res) {
    return await this.service.fetchAll(query)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
