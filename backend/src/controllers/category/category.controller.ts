import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Res } from '@nestjs/common';
import { CategoryService } from 'src/services/category/category.service';
import { handleError, handleResponse } from 'src/utils/handles';

@Injectable()
@Controller('categories')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get() async list(@Res() res) {
    try {
      const result = await this.service.list()

      return handleResponse(res, 200, '', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Get('month/:id') async listByMonth(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.listByMonth(id)

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

      return handleResponse(res, 200, 'Categoria cadastrada com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Put() async put(@Param('id') id, @Body() body, @Res() res) {
    try {
      const result = await this.service.put(id, body)

      return handleResponse(res, 200, 'Categoria atualizada com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }

  @Delete() async delete(@Param('id') id, @Res() res) {
    try {
      const result = await this.service.delete(id)

      return handleResponse(res, 200, 'Categoria excluída com sucesso.', result)
    }
    catch(e) {
      return handleError(res, e)
    }
  }
}
