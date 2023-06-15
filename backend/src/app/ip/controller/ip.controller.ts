import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/shared/BaseController';
import { IpService } from '../service/ip.service';

@ApiTags('ips')
@Injectable()
@Controller('ips')
export class IpController extends BaseController {
  constructor(service: IpService) { 
    super(service) 
  }
}
