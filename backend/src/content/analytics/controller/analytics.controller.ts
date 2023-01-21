import { Controller, Get, Res } from '@nestjs/common';
import { handleError, handleResponse } from 'src/utils/handlers';
import { AnalyticsService } from '../service/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('recent-expenses') async recentExpenses(@Res() res) {
    return await this.service.recentExpenses()
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }
}
