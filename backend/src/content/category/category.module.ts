import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Month } from '../month/Month';
import { Category } from './Category';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Month])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
