import { Controller, Req, Get, Res } from '@nestjs/common';
import { handleError, handleResponse } from 'src/utils/handlers';
import { AnalyticsService } from '../service/analytics.service';
import { GlobalException } from 'src/shared/GlobalException';

@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('recent-expenses') async recentExpenses(@Req() req, @Res() res) {
    return await this.service.recentExpenses()
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleError(req, res, error))
  }
}
