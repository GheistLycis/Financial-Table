import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Res } from '@nestjs/common';
import { YearService } from 'src/services/year/year.service';
import { handleError, handleResponse } from 'src/utils/handles';

@Injectable()
@Controller('year')
export class YearController {
  constructor(private service: YearService) {}

  @Get() async list(@Res() res) {
    try {
      const result = await this.service.list()

      return handleResponse(res, 200, '', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Get(':id') async getById(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.getById(id)

      return handleResponse(res, 200, '', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Post() async post(@Body() body, @Res() res) {
    try {
      const result = await this.service.post(body)

      return handleResponse(res, 200, 'Ano cadastrado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Put() async put(@Param('id') id, @Body() body, @Res() res) {
    try {
      const result = await this.service.put(id, body)

      return handleResponse(res, 200, 'Ano atualizado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Delete() async delete(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.delete(id)

      return handleResponse(res, 200, 'Ano excluído com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }
}
