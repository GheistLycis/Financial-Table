import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Res } from '@nestjs/common';
import { MonthService } from 'src/services/month/month.service';
import { YearService } from 'src/services/year/year.service';
import { handleError, handleResponse } from 'src/utils/handles';

@Injectable()
@Controller('month')
export class MonthController {
  constructor(private service: MonthService) {}

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

      return handleResponse(res, 200, 'Mês cadastrado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Put() async put(@Param('id') id, @Body() body, @Res() res) {
    try {
      const result = await this.service.put(id, body)

      return handleResponse(res, 200, 'Mês atualizado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Delete() async delete(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.delete(id)

      return handleResponse(res, 200, 'Mês excluído com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }
}
