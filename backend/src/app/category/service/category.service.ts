import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { Month } from 'src/app/month/Month';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { Category } from '../Category';
import CategoryDTO from '../Category.dto';
// import { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'src/app/user/User';

type body = { name: string, color: string, percentage: number, month: Month['id'] }
type queries = { month: Month['id'] }

@Injectable()
export class CategoryService implements BaseService<CategoryDTO> {
  constructor(
    @Repo(Category) private repo: Repository<Category>,
    @Repo(Month) private monthRepo: Repository<Month>,
    // @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list(user: User['id'], { month }: queries) {
    const query = this.repo.createQueryBuilder('Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })

    if(month) query.andWhere('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => Category.toDTO(row)))
  }

  async get(user: User['id'], id: CategoryDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhuma categoria encontrada.')

    return Category.toDTO(entity)
  }

  async post(user: User['id'], { name, color, percentage, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.name = :name', { name })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta categoria já existe.')

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

  async put(user: User['id'], id: CategoryDTO['id'], { name, color, percentage, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.id != :id', { id })
      .andWhere('Category.name = :name', { name })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta categoria já existe.')
    
    const entity = await this.repo.createQueryBuilder('Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    entity.name = name
    entity.color = color
    entity.percentage = percentage

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async delete(user: User['id'], id: CategoryDTO['id']) {
    let entity = await this.repo.createQueryBuilder('Category')
      .innerJoin('Category.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Categoria não encontrada.')
    
    entity = await this.repo.findOneBy({ id })

    await this.repo.remove(entity)
    
    // await this.cacheService.reset()

    return Category.toDTO(entity)
  }
}
