import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MonthlyEntryService } from 'src/services/monthly-entry/monthly-entry.service';
import { handleError, handleResponse } from 'src/utils/handles';

@ApiTags('monthly-entries')
@Injectable()
@Controller('monthly-entries')
export class MonthlyEntryController {
  constructor(private service: MonthlyEntryService) {}

  @Get() async list(@Query() query, @Res() res) {
    try {
      const result = await this.service.list(query)

      return handleResponse(res, 200, '', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Get(':id') async get(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.get(id)

      return handleResponse(res, 200, '', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Post() async post(@Body() body, @Res() res) {
    try {
      const result = await this.service.post(body)

      return handleResponse(res, 200, 'Registro mensal cadastrado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Put(':id') async put(@Param('id') id, @Body() body, @Res() res) {
    try {
      const result = await this.service.put(id, body)

      return handleResponse(res, 200, 'Registro mensal atualizado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Delete(':id') async delete(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.delete(id)

      return handleResponse(res, 200, 'Registro mensal excluído com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }
}
