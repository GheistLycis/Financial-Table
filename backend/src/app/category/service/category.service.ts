import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { Month } from 'src/app/month/Month';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { Category } from '../Category';
import CategoryDTO from '../Category.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

type body = { name: string, color: string, percentage: number, month: Month['id'] }
type queries = { month: Month['id'] }

@Injectable()
export class CategoryService implements BaseService<CategoryDTO> {
  constructor(
    @Repo(Category) private repo: Repository<Category>,
    @Repo(Month) private monthRepo: Repository<Month>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list({ month }: queries) {
    const query = this.repo.createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')

    if(month) query.where('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => Category.toDTO(row)))
  }

  async get(id: CategoryDTO['id']) {
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
      percentage: +percentage,
      month: monthEntity
    })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async put(id: CategoryDTO['id'], { name, color, percentage, month }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    const repeated = await this.repo.createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .where('Category.id != :id', { id })
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
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async delete(id: CategoryDTO['id']) {
    const entity = await this.repo.findOne({ 
      where: { id },
      relations: ['expenses']
    })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    await this.repo.softRemove(entity)
    
    await this.cacheService.reset()

    return Category.toDTO(entity)
  }
}
