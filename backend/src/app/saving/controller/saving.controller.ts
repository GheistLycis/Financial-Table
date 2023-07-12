import { Body, Controller, Injectable, Put, Param, ParseIntPipe, Post, Req  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { SavingService } from '../service/saving.service';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';

@ApiTags('savings')
@Injectable()
@Controller('savings')
export class SavingController extends BaseController {
  constructor(service: SavingService) { 
    super(service) 
  }
  
  @Post()
  async post(@Body() body, @Req() req): Promise<GlobalResponse> {
    return await this.service.post(body, req['user'].id).then((data: unknown) => ({ data }))
  }
  
  @Put('update-status/:id') 
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body): Promise<GlobalResponse> {
    return await this.service.updateStatus(id, body).then(data => ({ data }))
  }
}
