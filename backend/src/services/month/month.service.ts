import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import CategoryDTO from 'src/DTOs/category';
import MonthDTO from 'src/DTOs/month';
import YearDTO from 'src/DTOs/year';
import { Category } from 'src/entities/Category';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { month: string, year: YearDTO, categories: CategoryDTO[] }

@Injectable()
export class MonthService {
  repo = dataSource.getRepository(Month)
  yearRepo = dataSource.getRepository(Year)
  categoryRepo = dataSource.getRepository(Category)

  async list(): Promise<MonthDTO[]> {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Month.toDTO(row))
  }

  async listByYear(id): Promise<MonthDTO[]> {
    const entities = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Year.id = :id', { id })
      .orderBy('Month.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Month.toDTO(row))
  }

  async getById(id): Promise<MonthDTO> {
    const entity = await this.repo.findOneBy({ id })

    return Month.toDTO(entity)
  }

  async post(body: body): Promise<MonthDTO> {
    const { month, year, categories } = body

    const repeated = await this.repo.findOneBy({ month })
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year.id })

    const categoryEntities = await this.categoryRepo.createQueryBuilder('Category')
      .where('Category.id IN :ids', { ids: categories.map(category => category.id) })
      .getMany()
    
    const entity = this.repo.create({ month, year: yearEntity, categories: categoryEntities })
      
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id, body: body): Promise<MonthDTO> {
    const { month, year, categories } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year.id })

    const categoryEntities = await this.categoryRepo.createQueryBuilder('Category')
      .where('Category.id IN :ids', { ids: categories.map(category => category.id) })
      .getMany()

    entity.month = month
    entity.year = yearEntity
    entity.categories = categoryEntities

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id): Promise<MonthDTO> {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)

    return Month.toDTO(entity)
  }
}
