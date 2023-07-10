import { Inject, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import ExpenseDTO from '../Expense.dto';
import { Expense } from '../Expense';
import { Tag } from '../../tag/Tag';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Year } from 'src/app/year/Year';
import { Month } from 'src/app/month/Month';
import { Category } from 'src/app/category/Category';
import TagDTO from 'src/app/tag/Tag.dto';
import UserDTO from 'src/app/user/User.dto';

type body = { value: number, description: string, date: Date, category: Category['id'], tags: TagDTO[] }
type queries = { year: Year['id'], month: Month['id'], category: Category['id'], tags: Tag['id'][] }

@Injectable()
export class ExpenseService implements BaseService<ExpenseDTO> {
  constructor(
    @Repo(Expense) private repo: Repository<Expense>,
    @Repo(Category) private categoryRepo: Repository<Category>,
    @Repo(Tag) private tagRepo: Repository<Tag>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list({ year, month, category, tags }: queries, id: UserDTO['id']) {
    const cacheKey = `${id}-expenses-${year}_${month}_${category}_${tags}`
    
    const cache = await this.cacheService.get<ExpenseDTO[]>(cacheKey)
    if(cache) return cache
    
    const query = this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.tags', 'Tag')
      .leftJoinAndSelect('Expense.category', 'Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')

    if(year) query.where('Year.id = :year', { year })
    if(month) query.where('Month.id = :month', { month })
    if(category) query.where('Category.id = :category', { category })
    if(tags.length) query.where('Tag.id IN (:...tags)', { tags })

    return await query.getMany().then(entities => {
      const result = entities.map(row => Expense.toDTO(row))
      
      this.cacheService.set(cacheKey, result)
      return result
    })
  }

  async get(id: ExpenseDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum registro encontrado.')

    return Expense.toDTO(entity)
  }

  async post({ value, description, date, category, tags }: body) {
    const repeated = await this.repo.createQueryBuilder('Expense')
      .where('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })
    
    const entity = this.repo.create({ 
      value, 
      description, 
      date,
      category: categoryEntity,
      tags
    })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)
    
    this.cacheService.reset()

    return Expense.toDTO(entity)
  }

  async put(id: ExpenseDTO['id'], { value, description, date, category, tags }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Expense')
      .where('Expense.id != :id', { id })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })
    const tagEntities = await this.tagRepo.findBy({ id: In(tags.map(({ id }) => id)) })

    entity.value = value
    entity.description = description
    entity.date = date
    entity.category = categoryEntity
    entity.tags = tagEntities

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)
    
    this.cacheService.reset()

    return Expense.toDTO(entity)
  }

  async delete(id: ExpenseDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    await this.repo.softRemove(entity)
    
    await this.cacheService.reset()

    return Expense.toDTO(entity)
  }
}
