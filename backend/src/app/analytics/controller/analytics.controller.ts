import { Controller, Req, Get, Res, Param } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import { AnalyticsService } from '../service/analytics.service';
import GlobalException from 'src/shared/interfaces/GlobalException';


@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('year-history/:id') async yearHistory(@Req() req, @Param('id') id, @Res() res) {
    return await this.service.yearHistory(id)
      .then(data => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
  
  @Get('category-remaining/:id') async categoryRemaining(@Req() req, @Param('id') id, @Res() res) {
    return await this.service.categoryRemaining(id)
      .then(data => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
