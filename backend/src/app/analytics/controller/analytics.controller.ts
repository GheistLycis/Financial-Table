import { Controller, Req, Get, Res } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/functions/GlobalHandlers';
import { AnalyticsService } from '../service/analytics.service';
import GlobalException from 'src/shared/interfaces/GlobalException';

@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('recent-expenses') async recentExpenses(@Req() req, @Res() res) {
    return await this.service.recentExpenses()
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
