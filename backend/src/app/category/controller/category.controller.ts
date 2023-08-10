import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BaseController from '@classes/BaseController';
import { CategoryService } from '../service/category.service';

@ApiTags('categories')
@Injectable()
@Controller('categories')
export class CategoryController extends BaseController {
  constructor(service: CategoryService) { 
    super(service) 
  }
}
