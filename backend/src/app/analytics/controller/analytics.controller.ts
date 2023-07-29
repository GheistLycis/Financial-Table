import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { AnalyticsService } from '../service/analytics.service';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';
import CategoryDTO from 'src/app/category/Category.dto';
import MonthDTO from 'src/app/month/Month.dto';
import YearDTO from 'src/app/year/Year.dto';
import { Request } from 'express';


@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('category-remaining/:id')
  async categoryRemaining(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: CategoryDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.categoryRemaining(req['user'].id, id).then(data => ({ data }))
  }

  @Post('category-chart')
  async categoryChart(
    @Req() req: Request,
    @Body() body: MonthDTO['id'][]
  ): Promise<GlobalResponse> {
    if(!body.length) return { data: null }
    
    return await this.service.categoryChart(req['user'].id, body).then(data => ({ data }))
  }
  
  @Get('month-balance/:id')
  async monthBalance(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.monthBalance(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('most-expensive-category/:id')
  async mostExpensiveCategory(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.mostExpensiveCategory(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('most-expensive-tags/:id')
  async mostExpensiveTags(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.mostExpensiveTags(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('month-history/:id')
  async monthHistory(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.monthHistory(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('recent-expenses/:id')
  async recentExpenses(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.recentExpenses(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('year-expenses/:id')
  async yearExpenses(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: MonthDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.yearExpenses(req['user'].id, id).then(data => ({ data }))
  }
  
  @Get('year-history/:id')
  async yearHistory(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: YearDTO['id']
  ): Promise<GlobalResponse> {
    return await this.service.yearHistory(req['user'].id, id).then(data => ({ data }))
  }
}
