import { Controller, Injectable, } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { BaseController } from 'src/shared/BaseController';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Injectable()
@Controller('users')
export class UserController extends BaseController {
  constructor(service: UserService) { 
    super(service) 
  }
}