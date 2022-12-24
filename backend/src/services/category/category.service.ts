import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { dataSource } from 'src/configs/data-source';
import CategoryDTO from 'src/DTOs/category';
import { Category } from 'src/entities/Category';
import { Month } from 'src/entities/Month';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { name: string, color: string, percentage: number, month: string }
export type query = { month: string }
export type oneReturn = Promise<CategoryDTO>
export type manyReturn = Promise<CategoryDTO[]>

@Injectable()
export class CategoryService {
  repo = dataSource.getRepository(Category)
  monthRepo = dataSource.getRepository(Month)

  async list({ month }: query): manyReturn {
    const query = this.repo
      .createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .orderBy('Category.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    const entities = await query.getMany()

    return entities.map(row => Category.toDTO(row))
  }

  async get(id: string): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhuma categoria encontrada.')

    return Category.toDTO(entity)
  }

  async post({ name, color, percentage, month }: body): oneReturn {
    const repeated = await this.repo.findOneBy({ name })
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

  async put(id: string, { name, color, percentage, month }: body): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

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

  async delete(id: string): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    await this.repo.softRemove(entity)

    return Category.toDTO(entity)
  }
}
