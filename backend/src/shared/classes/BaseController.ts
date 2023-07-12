import { Body, Req, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import GlobalResponse from '../interfaces/GlobalResponse';
import { Request } from 'express';
import BaseDTO from '../interfaces/BaseDTO';

export default class BaseController {
  constructor(protected service) {}

  @Get()
  async list(
    @Req() req: Request,
    @Query() query: Object,
    ...args: unknown[]
  ): Promise<GlobalResponse> {
    return await this.service.list(req['user'].id, query).then((data: unknown) => ({ data }))
  }

  @Get(':id')
  async get(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: BaseDTO['id'],
    ...args: unknown[]
  ): Promise<GlobalResponse> {
    return await this.service.get(req['user'].id, id).then((data: unknown) => ({ data }))
  }

  @Post()
  async post(
    @Req() req: Request,
    @Body() body: unknown,
    ...args: unknown[]
  ): Promise<GlobalResponse> {
    return await this.service.post(req['user'].id, body).then((data: unknown) => ({ data }))
  }

  @Put(':id')
  async put(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: BaseDTO['id'], 
    @Body() body: unknown,
    ...args: unknown[]
  ): Promise<GlobalResponse> {
    return await this.service.put(req['user'].id, id, body).then((data: unknown) => ({ data }))
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: BaseDTO['id'],
    ...args: unknown[]
  ): Promise<GlobalResponse> {
    return await this.service.delete(req['user'].id, id).then((data: unknown) => ({ data }))
  }
}