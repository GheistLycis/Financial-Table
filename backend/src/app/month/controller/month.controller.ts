import { Controller, Injectable, Param, Post, Query, Req, Res, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from 'src/shared/classes/BaseController';
import { MonthService } from '../service/month.service';
import { handleException, handleResponse } from 'src/shared/functions/globalHandlers';
import GlobalException from 'src/shared/interfaces/GlobalException';
import { BadRequestException, ServerException } from 'src/shared/functions/globalExceptions';

@ApiTags('months')
@Injectable()
@Controller('months')
export class MonthController extends BaseController {
  constructor(service: MonthService) { 
    super(service) 
  }
  
  @Post('duplicate/:id') 
  async duplicate(@Req() req, @Param('id') id, @Query() query, @Res() res) {
    if(query.duplicateCategories == 'false' && query.duplicateGroups == 'true') {
      return handleException(req, res, BadRequestException('Não é possível duplicar grupos sem duplicar as categorias do mês.'))
    }
    
    return await this.service.duplicate(id, query)
      .then(data => handleResponse(res, { data }))
      .catch((error: GlobalException | Error) => handleException(req, res, error))
  }
}
