import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/configs/BaseService';
import { dataSource } from 'src/configs/data-source';
import CategoryDTO from 'src/DTOs/category';
import { Category } from 'src/entities/Category';
import { Month } from 'src/entities/Month';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

type body = { name: string, color: string, percentage: number, month: string }
type query = { month: string }

@Injectable()
export class CategoryService implements BaseService<Category, CategoryDTO> {
  repo = dataSource.getRepository(Category)
  monthRepo = dataSource.getRepository(Month)

  async list({ month }: query) {
    const query = this.repo
      .createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Category.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    const entities = await query.getMany()

    return entities.map(row => Category.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhuma categoria encontrada.')

    return Category.toDTO(entity)
  }

  async post({ name, color, percentage, month }: body) {
    const repeated = await this.repo.createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .where('Category.name = :name', { name })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Esta categoria já foi cadastrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })
    
    const entity = this.repo.create({ 
      name, 
      color, 
      percentage,
      month: monthEntity
    })

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async put(id, { name, color, percentage, month }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    const repeated = await this.repo.createQueryBuilder('Category')
      .leftJoinAndSelect('Category.group', 'Month')
      .where('Category.name = :name', { name })
      .andWhere('Category.name = :name', { name })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Esta categoria já foi cadastrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })

    entity.name = name
    entity.color = color
    entity.percentage = percentage
    entity.month = monthEntity

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    await this.repo.softRemove(entity)

    return Category.toDTO(entity)
  }
}
