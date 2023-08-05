import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import ExpenseDTO from '../Expense.dto';
import { Expense } from '../Expense';
import { Tag } from '../../tag/Tag';
import { BadRequestException, classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Year } from 'src/app/year/Year';
import { Month } from 'src/app/month/Month';
import { Category } from 'src/app/category/Category';
import TagDTO from 'src/app/tag/Tag.dto';
import { User } from 'src/app/user/User';

const paginationSize = 30

type body = { value: number, description: string, date: string | Date, category: Category['id'], tags: TagDTO[] }
type queries = {
  year?: Year['id']
  months?: Month['id'][] 
  categories?: Category['id'][]
  tags?: Tag['id'][]
  description?: string
  orderBy?: ['date' | 'value', 'ASC' | 'DESC']
  page?: string
}

@Injectable()
export class ExpenseService implements BaseService<ExpenseDTO> {
  constructor(
    @Repo(Expense) private repo: Repository<Expense>,
    @Repo(Category) private categoryRepo: Repository<Category>,
    @Repo(Tag) private tagRepo: Repository<Tag>,
    // @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list(user: User['id'], { year, months, categories, tags, description, orderBy, page }: queries) {
    // const cacheKey = `${user}-expenses-${year}_${months}_${categories}_${tags}`
    
    // const cache = await this.cacheService.get<ExpenseDTO[]>(cacheKey)
    // if(cache) {
    //   if(!page) return cache
      
    //   const offset = paginationSize * +page
      
    //   return cache.slice(offset, offset + paginationSize)
    // }
    
    const query = this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.category', 'Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .leftJoin('Expense.tags', 'Tag')
      .where('User.id = :user', { user })

    if(year) query.andWhere('Year.id = :year', { year })
    if(months?.length) query.andWhere('Month.id IN (:...months)', { months })
    if(categories?.length) query.andWhere('Category.id IN (:...categories)', { categories })
    if(tags?.length) query.andWhere('Tag.id IN (:...tags)', { tags })
    if(description) query.andWhere("LOWER(Expense.description) LIKE LOWER(:description)", { description: `%${description}%` })
    if(orderBy?.length) query.orderBy('Expense.' + orderBy[0], orderBy[1])
    if(page) query
      .offset(paginationSize * +page)
      .limit(paginationSize + 1)

    return await query.getMany().then(entities => {
      const result = entities.map(row => Expense.toDTO(row))
      
      // this.cacheService.set(cacheKey, result)
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

  async getCSV(user: User['id']): Promise<string | any> {
    const entities = await this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.category', 'Category')
      .leftJoinAndSelect('Expense.tags', 'Tags')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .getMany()

    return entities.reduce((acc, { date, value, description, category, tags }) => {
        return acc += `${date};${value};${description};${category.name};${tags.map(({ name }) => name).join(', ')}\n`
      }, 'Data;Valor;Descrição;Categoria;Tags\n')
  }

  async post(user: User['id'], { value, description, date, category, tags }: body) {
    if(date > new Date().toISOString().split('T')[0]) throw BadRequestException('A data de um registro não pode ser futura.')

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
    
    // this.cacheService.reset()

    return Expense.toDTO(entity)
  }

  async put(user: User['id'], id: ExpenseDTO['id'], { value, description, date, tags }: body) {
    if(date > new Date().toISOString().split('T')[0]) throw BadRequestException('A data de um registro não pode ser futura.')

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
    entity.date = date as Date
    entity.tags = tagEntities

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)
    
    // this.cacheService.reset()

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

    await this.repo.remove(entity)
    
    // await this.cacheService.reset()

    return Expense.toDTO(entity)
  }
}
