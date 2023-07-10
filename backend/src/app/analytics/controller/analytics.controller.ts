import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from '../service/analytics.service';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';
import CategoryDTO from 'src/app/category/Category.dto';
import MonthDTO from 'src/app/month/Month.dto';
import YearDTO from 'src/app/year/Year.dto';


@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('category-remaining/:id')
  async categoryRemaining(@Param('id', ParseIntPipe) id: CategoryDTO['id']): Promise<GlobalResponse> {
    return await this.service.categoryRemaining(id).then(data => ({ data }))
  }
  
  @Get('month-balance/:id')
  async monthBalance(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.monthBalance(id).then(data => ({ data }))
  }
  
  @Get('most-expensive-category/:id')
  async mostExpensiveCategory(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.mostExpensiveCategory(id).then(data => ({ data }))
  }
  
  @Get('most-expensive-tags/:id')
  async mostExpensiveTags(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.mostExpensiveTags(id).then(data => ({ data }))
  }
  
  @Get('month-history/:id')
  async monthHistory(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.monthHistory(id).then(data => ({ data }))
  }
  
  @Get('recent-expenses/:id')
  async recentExpenses(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.recentExpenses(id).then(data => ({ data }))
  }
  
  @Get('year-expenses/:id')
  async yearExpenses(@Param('id', ParseIntPipe) id: MonthDTO['id']): Promise<GlobalResponse> {
    return await this.service.yearExpenses(id).then(data => ({ data }))
  }
  
  @Get('year-history/:id')
  async yearHistory(@Param('id', ParseIntPipe) id: YearDTO['id']): Promise<GlobalResponse> {
    return await this.service.yearHistory(id).then(data => ({ data }))
  }
}
