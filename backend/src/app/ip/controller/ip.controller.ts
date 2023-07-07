import { Req, Body, Get, Param, Post, Put, Res, Injectable, Controller } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import GlobalException from 'src/shared/interfaces/GlobalException';
import { ApiTags } from '@nestjs/swagger';
import { IpService } from '../service/ip.service';

@ApiTags('ips')
@Injectable()
@Controller('ips')
export class IpController {
  constructor(protected service: IpService) {}

  @Get('list-by-user/:id') async listByUser(@Req() req, @Param('id') id, @Res() res) {
    return await this.service.listByUser(id)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Get(':ip') async get(@Req() req, @Param('ip') ip, @Res() res) {
    return await this.service.get(ip)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Post() async post(@Req() req, @Body() body, @Res() res) {
    return await this.service.post(body)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }

  @Put(':ip') async put(@Req() req, @Param('ip') ip, @Body() body, @Res() res) {
    return await this.service.put(ip, body)
      .then((data: any) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
