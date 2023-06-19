import { Controller, Injectable, } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { BaseController } from 'src/shared/BaseController';
import { ApiTags } from '@nestjs/swagger';
import { Post, Req, Body, Res } from '@nestjs/common';
import { handleException, handleResponse } from 'src/shared/globalHandlers';
import { GlobalException } from 'src/shared/GlobalException';
import { Session } from 'src/shared/Session';
import { BypassTokenGuard } from 'src/decorators/bypassTokenGuard';

@ApiTags('users')
@Injectable()
@Controller('users')
export class UserController extends BaseController {
  constructor(service: UserService) { 
    super(service) 
  }
  
  @Post('login') 
  @BypassTokenGuard()
  async logIn(@Req() req, @Body() { name }, @Res() res) {
    return await this.service.logIn(name)
      .then((data: Session) => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}