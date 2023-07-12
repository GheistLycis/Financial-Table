import { Body, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import GlobalResponse from '../interfaces/GlobalResponse';
import { Request } from 'express';
import BaseDTO from '../interfaces/BaseDTO';

export default class BaseController {
  constructor(protected service) {}

  @Get()
  async list(@Query() query: unknown, req?: Request): Promise<GlobalResponse> {
    return await this.service.list(query).then((data: unknown) => ({ data }))
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: BaseDTO['id'], req?: Request): Promise<GlobalResponse> {
    return await this.service.get(id).then((data: unknown) => ({ data }))
  }

  @Post()
  async post(@Body() body: unknown, req?: Request): Promise<GlobalResponse> {
    return await this.service.post(body).then((data: unknown) => ({ data }))
  }

  @Put(':id')
  async put(@Param('id', ParseIntPipe) id: BaseDTO['id'], @Body() body: unknown, req?: Request): Promise<GlobalResponse> {
    return await this.service.put(id, body).then((data: unknown) => ({ data }))
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: BaseDTO['id'], req?: Request): Promise<GlobalResponse> {
    return await this.service.delete(id).then((data: unknown) => ({ data }))
  }
}