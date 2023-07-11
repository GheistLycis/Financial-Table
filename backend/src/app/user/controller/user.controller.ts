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
    
    delete this.post
  }
  
  @Post('signup') 
  @BypassTokenGuard()
  @BypassIpGuard()
  async signUp(@Body() body): Promise<GlobalResponse> {
    return await this.service.signUp(body).then(data => ({ data }))
  }
  
  @Post('login') 
  @BypassTokenGuard()
  @BypassIpGuard()
  async logIn(@Body() body): Promise<GlobalResponse> {
    return await this.service.logIn(body).then(data => ({ data }))
  }
  
  @Post('reset-password') 
  async resetPassword(@Body() body): Promise<GlobalResponse> {
    return await this.service.resetPassword(body).then(data => ({ data }))
  }
}