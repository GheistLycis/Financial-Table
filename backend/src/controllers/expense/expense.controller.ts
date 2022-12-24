import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpenseService } from 'src/services/expense/expense.service';
import { handleError, handleResponse } from 'src/utils/handles';

@ApiTags('expenses')
@Injectable()
@Controller('expenses')
export class ExpenseController {
  constructor(private service: ExpenseService) {}

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

      return handleResponse(res, 200, 'Registro cadastrado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Put(':id') async put(@Param('id') id, @Body() body, @Res() res) {
    try {
      const result = await this.service.put(id, body)

      return handleResponse(res, 200, 'Registro atualizado com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Delete(':id') async delete(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.delete(id)

      return handleResponse(res, 200, 'Registro excluído com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }
}
