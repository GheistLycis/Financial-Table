import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/configs/BaseController';
import { CategoryService } from 'src/services/category/category.service';

@ApiTags('categories')
@Injectable()
@Controller('categories')
export class CategoryController extends BaseController {
  constructor(service: CategoryService) { 
    super(service) 
  }
}
