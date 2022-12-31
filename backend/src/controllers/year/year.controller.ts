import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { YearService } from 'src/services/year/year.service';
import { handleError, handleResponse } from 'src/utils/handles';

@ApiTags('years')
@Injectable()
@Controller('years')
export class YearController {
  constructor(private service: YearService) {}

  @Get() async list(@Res() res) {
    return await this.service.list()
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }

  @Get(':id') async get(@Param('id') id, @Res() res) {
    return await this.service.get(id)
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }

  @Post() async post(@Body() body, @Res() res) {
    return await this.service.post(body)
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }

  @Put(':id') async put(@Param('id') id, @Body() body, @Res() res) {
    return await this.service.put(id, body)
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }

  @Delete(':id') async delete(@Param('id') id, @Res() res) {
    return await this.service.delete(id)
      .then(result => handleResponse(res, 200, '', result))
      .catch(error => handleError(res, error))
  }
}
