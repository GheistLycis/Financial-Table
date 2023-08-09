import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from '@interfaces/BaseService';
import MonthlyIncomeDTO from '../MonthlyIncome.dto';
import { Month } from '../../month/Month';
import { MonthlyIncome } from '../MonthlyIncome';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/app/user/User';

type queries = { month: Month['id'] }

type body = { value: number, date?: Date, description: string, month: Month['id'] }
@Injectable()
export class MonthlyIncomeService implements BaseService<MonthlyIncomeDTO> {
  constructor(
    @Repo(MonthlyIncome) private repo: Repository<MonthlyIncome>,
    @Repo(Month) private monthRepo: Repository<Month>,
  ) {}

  async list(user: User['id'], { month }: queries) {
    const query = this.repo.createQueryBuilder('Income')
      .innerJoinAndSelect('Income.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .addOrderBy('Income.createdAt', 'DESC')

    if(month) query.andWhere('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => MonthlyIncome.toDTO(row)))
  }
  
  async upNext(user: User['id']): Promise<MonthlyIncomeDTO[]> {
    const entities = await this.repo.createQueryBuilder('Income')
      .innerJoin('Income.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Income.date >= CURRENT_DATE')
      .orderBy('Income.date')
      .getMany()

    return entities.map(row => MonthlyIncome.toDTO(row))
  }

  async get(user: User['id'], id: MonthlyIncomeDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Income')
      .innerJoinAndSelect('Income.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Income.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhuma entrada mensal encontrada.')

    return MonthlyIncome.toDTO(entity)
  }

  async post(user: User['id'], { value, date, description, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Income')
      .innerJoin('Income.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :month', { month })
      .andWhere('Income.value = :value', { value })
      .andWhere('Income.date = :date', { date })
      .andWhere('Income.description = :description', { description })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta entrada mensal já existe.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })
    
    const entity = this.repo.create({ 
      value,
      date,
      description,
      month: monthEntity 
    })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return MonthlyIncome.toDTO(entity)
  }

  async put(user: User['id'], id: MonthlyIncomeDTO['id'], { value, date, description, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Income')
      .innerJoin('Income.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Income.id != :id', { id })
      .andWhere('Month.id = :month', { month })
      .andWhere('Income.value = :value', { value })
      .andWhere('Income.date = :date', { date })
      .andWhere('Income.description = :description', { description })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta entrada mensal já existe.')
  
    const entity = await this.repo.createQueryBuilder('Income')
      .innerJoin('Income.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Income.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Entrada mensal não encontrada.')
    
    entity.value = value
    entity.date = date
    entity.description = description

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyIncome.toDTO(entity)
  }

  async delete(user: User['id'], id: MonthlyIncomeDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Income')
      .innerJoin('Income.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Income.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Entrada mensal não encontrada.')

    await this.repo.remove(entity)

    return MonthlyIncome.toDTO(entity)
  }
}
