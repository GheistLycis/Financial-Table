import { Req, Body, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import GlobalException from '../interfaces/GlobalException';

export default class BaseController {
  constructor(protected service) {}

  @Get() async list(@Req() req, @Query() query, @Res() res) {
    return await this.service.list(query)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Get(':id') async get(@Req() req, @Param('id') id, @Res() res) {
    return await this.service.get(id)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Post() async post(@Req() req, @Body() body, @Res() res) {
    return await this.service.post(body)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Put(':id') async put(@Req() req, @Param('id') id, @Body() body, @Res() res) {
    return await this.service.put(id, body)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Delete(':id') async delete(@Req() req, @Param('id') id, @Res() res) {
    return await this.service.delete(id)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}