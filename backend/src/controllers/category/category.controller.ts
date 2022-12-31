import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/services/category/category.service';
import { handleError, handleResponse } from 'src/utils/handles';

@ApiTags('categories')
@Injectable()
@Controller('categories')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get() async list(@Query() query, @Res() res) {
    return await this.service.list(query)
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
