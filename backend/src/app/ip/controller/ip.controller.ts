import { Body, Get, Param, Post, Put, Injectable, Controller, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IpService } from '../service/ip.service';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';
import UserDTO from 'src/app/user/User.dto';
import IpDTO from '../Ip.dto';

@ApiTags('ips')
@Injectable()
@Controller('ips')
export class IpController {
  constructor(protected service: IpService) {}

  @Get('list-by-user/:id')
  async listByUser(@Param('id', ParseIntPipe) id: UserDTO['id']): Promise<GlobalResponse> {
    return await this.service.listByUser(id).then(data => ({ data }))
  }

  @Get(':ip')
  async get(@Param('ip') ip: IpDTO['ip']): Promise<GlobalResponse> {
    return await this.service.get(ip).then(data => ({ data }))
  }

  @Post()
  async post(@Body() body): Promise<GlobalResponse> {
    return await this.service.post(body).then(data => ({ data }))
  }

  @Put(':ip')
  async put(@Param('ip') ip: IpDTO['ip'], @Body() body): Promise<GlobalResponse> {
    return await this.service.put(ip, body).then(data => ({ data }))
  }
}
