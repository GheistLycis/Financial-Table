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
import { Year } from 'src/app/year/Year';
import { Month } from 'src/app/month/Month';
import { Category } from 'src/app/category/Category';
import TagDTO from 'src/app/tag/Tag.dto';
import { User } from 'src/app/user/User';

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

  async list(user: User['id'], { year, month, category, tags }: queries) {
    const cacheKey = `${user}-expenses-${year}_${month}_${category}_${tags}`
    
    const cache = await this.cacheService.get<ExpenseDTO[]>(cacheKey)
    if(cache) return cache
    
    const query = this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.category', 'Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .leftJoin('Expense.tags', 'Tag')
      .where('User.id = :user', { user })

    if(year) query.andWhere('Year.id = :year', { year })
    if(month) query.andWhere('Month.id = :month', { month })
    if(category) query.andWhere('Category.id = :category', { category })
    if(tags.length) query.andWhere('Tag.id IN (:...tags)', { tags })

    return await query.getMany().then(entities => {
      const result = entities.map(row => Expense.toDTO(row))
      
      this.cacheService.set(cacheKey, result)
      return result
    })
  }

  async get(user: User['id'], id: ExpenseDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.category', 'Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhum registro encontrado.')

    return Expense.toDTO(entity)
  }

  async post(user: User['id'], { value, description, date, category, tags }: body) {
    const duplicated = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.category', 'Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .getOne()
    if(duplicated) throw DuplicatedException('Este registro já existe.')

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

  async put(user: User['id'], id: ExpenseDTO['id'], { value, description, date, tags }: body) {
    const duplicated = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.category', 'Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id != :id', { id })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .getOne()
    if(duplicated) throw DuplicatedException('Este registro já existe.')
    
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.category', 'Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Registro não encontrado.')

    // TODO: check if user owns every tag requested else throw 403
    const tagEntities = await this.tagRepo.findBy({ id: In(tags.map(({ id }) => id)) })

    entity.value = value
    entity.description = description
    entity.date = date
    entity.tags = tagEntities

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)
    
    this.cacheService.reset()

    return Expense.toDTO(entity)
  }

  async delete(user: User['id'], id: ExpenseDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.category', 'Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Registro não encontrado.')

    await this.repo.softRemove(entity)
    
    await this.cacheService.reset()

    return Expense.toDTO(entity)
  }
}
