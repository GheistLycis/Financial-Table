import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import MonthlyExpenseDTO from '../MonthlyExpense.dto';
import { Month } from '../../month/Month';
import { MonthlyExpense } from '../MonthlyExpense';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/app/user/User';

type body = { value: number, date?: Date, description?: string, month: Month['id'] }
type queries = { month: Month['id'] }

@Injectable()
export class MonthlyExpenseService implements BaseService<MonthlyExpenseDTO> {
  constructor(
    @Repo(MonthlyExpense) private repo: Repository<MonthlyExpense>,
    @Repo(Month) private monthRepo: Repository<Month>,
  ) {}

  async list(user: User['id'], { month }: queries) {
    const query = this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .addOrderBy('Expense.createdAt', 'DESC')

    if(month) query.andWhere('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => MonthlyExpense.toDTO(row)))
  }
  
  async upNext(user: User['id']): Promise<MonthlyExpenseDTO[]> {
    const entities = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.date >= CURRENT_DATE')
      .orderBy('Expense.date')
      .getMany()

    return entities.map(row => MonthlyExpense.toDTO(row))
  }

  async get(user: User['id'], id: MonthlyExpenseDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoinAndSelect('Expense.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhum gasto fixo encontrado.')

    return MonthlyExpense.toDTO(entity)
  }

  async post(user: User['id'], { value, date, description, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :month', { month })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.date = :date', { date })
      .andWhere('Expense.description = :description', { description })
      .getOne()
    if(duplicated) throw DuplicatedException('Este gasto fixo já existe.')

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

    return MonthlyExpense.toDTO(entity)
  }

  async put(user: User['id'], id: MonthlyExpenseDTO['id'], { value, date, description, month }: body) {
    const duplicated = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id != :id', { id })
      .andWhere('Month.id = :month', { month })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.date = :date', { date })
      .andWhere('Expense.description = :description', { description })
      .getOne()
    if(duplicated) throw DuplicatedException('Este gasto fixo já existe.')
  
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.month', 'Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Gasto fixo não encontrado.')
    
    entity.value = value
    entity.date = date
    entity.description = description

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyExpense.toDTO(entity)
  }

  async delete(user: User['id'], id: MonthlyExpenseDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Expense')
      .innerJoin('Expense.month', 'Month')
      .innerJoin('Month.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Expense.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Gasto fixo não encontrado.')

    await this.repo.softRemove(entity)

    return MonthlyExpense.toDTO(entity)
  }
}
