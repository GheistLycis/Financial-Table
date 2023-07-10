import { Controller, Injectable, } from '@nestjs/common';
import { UserService } from '../service/user.service';
import BaseController from 'src/shared/classes/BaseController';
import { ApiTags } from '@nestjs/swagger';
import { Post, Body } from '@nestjs/common';
import BypassTokenGuard from 'src/shared/decorators/BypassTokenGuard';
import BypassIpGuard from 'src/shared/decorators/BypassIpGuard';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';

@ApiTags('users')
@Injectable()
@Controller('users')
export class UserController extends BaseController {
  constructor(service: UserService) { 
    super(service) 
  }
  
  @Post('login') 
  @BypassTokenGuard()
  @BypassIpGuard()
  async logIn(@Body() { name }): Promise<GlobalResponse> {
    return await this.service.logIn(name).then(data => ({ data }))
  }
}