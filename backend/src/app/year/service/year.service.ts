import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import YearDTO from '../Year.dto';
import { Year } from '../Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/app/user/User';

type body = { year: number }

@Injectable()
export class YearService implements BaseService<YearDTO> {
  constructor(
    @Repo(Year) private repo: Repository<Year>,
    @Repo(User) private userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list(user: User['id']) {
    const entitites = await this.repo.createQueryBuilder('Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .getMany()

    return entitites.map(row => Year.toDTO(row))
  }

  async get(user: User['id'], id: YearDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhum ano encontrado.')

    return Year.toDTO(entity)
  }

  async post(user: User['id'], { year }: body) {   
    const duplicated = await this.repo.createQueryBuilder('Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.year = :year', { year })
      .getOne()
    if(duplicated) throw DuplicatedException('Este ano já existe.')
    
    const userEntity = await this.userRepo.findOneBy({ id: user })
    
    const entity = this.repo.create({ 
      year, 
      user: userEntity,
    })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(user: User['id'], id: YearDTO['id'], { year }: body) {
    const duplicated = await this.repo.createQueryBuilder('Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.id != :id', { id })
      .andWhere('Year.year = :year', { year })
      .getOne()
    if(duplicated) throw DuplicatedException('Este ano já existe.')
  
    const entity = await this.repo.createQueryBuilder('Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Ano não encontrado.')

    entity.year = year

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async delete(user: User['id'], id: YearDTO['id']) {
    let entity = await this.repo.createQueryBuilder('Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Ano não encontrado.')
    
    entity = await this.repo.findOne({ 
      where: { id },
      relations: [
        'months', 'months.incomes', 'months.expenses', 'months.categories', 
        'months.categories.expenses'
      ]
    })

    await this.repo.softRemove(entity)
    
    await this.cacheService.reset()

    return Year.toDTO(entity)
  }
}
