import { Controller, Injectable, Param, ParseIntPipe, Req, } from '@nestjs/common';
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
  
  @Post('reset-password/:id') 
  async resetPassword(
    @Req() req, 
    @Param('id', ParseIntPipe) id: number, 
    @Body() body
  ): Promise<GlobalResponse> {
    return await this.service.resetPassword(req['user'].id, id, body).then(data => ({ data, message: 'Senha atualizada com sucesso!' }))
  }
}