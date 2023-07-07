import { Controller, Injectable, } from '@nestjs/common';
import { UserService } from '../service/user.service';
import BaseController from 'src/shared/classes/BaseController';
import { ApiTags } from '@nestjs/swagger';
import { Post, Req, Body, Res } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import GlobalException from 'src/shared/interfaces/GlobalException';
import Session from 'src/shared/interfaces/Session';
import BypassTokenGuard from 'src/shared/decorators/BypassTokenGuard';
import BypassIpGuard from 'src/shared/decorators/BypassIpGuard';

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
  async logIn(@Req() req, @Body() { name }, @Res() res) {
    return await this.service.logIn(name)
      .then((data: Session) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}