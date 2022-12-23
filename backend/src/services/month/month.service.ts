import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import MonthDTO from 'src/DTOs/month';
import { Category } from 'src/entities/Category';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { month: number, year: string, categories: string[] }
export type oneReturn = Promise<MonthDTO>
export type manyReturn = Promise<MonthDTO[]>

@Injectable()
export class MonthService {
  repo = dataSource.getRepository(Month)
  yearRepo = dataSource.getRepository(Year)
  categoryRepo = dataSource.getRepository(Category)

  async list(): manyReturn {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Month.toDTO(row))
  }

  async listByYear(id): manyReturn {
    const entities = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Year.id = :id', { id })
      .orderBy('Month.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Month.toDTO(row))
  }

  async getById(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })

    return Month.toDTO(entity)
  }

  async post(body: body): oneReturn {
    const { month, year, categories } = body

    const repeated = await this.repo.findOneBy({ month })
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })

    const categoryEntities = await this.categoryRepo.createQueryBuilder('Category')
      .where('Category.id IN :categories', { categories })
      .getMany()
    
    const entity = this.repo.create({ month, year: yearEntity, categories: categoryEntities })
      
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id, body: body): oneReturn {
    const { month, year, categories } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })

    const categoryEntities = await this.categoryRepo.createQueryBuilder('Category')
      .where('Category.id IN :categories', { categories })
      .getMany()

    entity.month = month
    entity.year = yearEntity
    entity.categories = categoryEntities

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)

    return Month.toDTO(entity)
  }
}
