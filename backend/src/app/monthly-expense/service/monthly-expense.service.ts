import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import MonthlyExpenseDTO from '../MonthlyExpense.dto';
import { Month } from '../../month/Month';
import { MonthlyExpense } from '../MonthlyExpense';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { value: number, description: string, month: Month['id'] }
type queries = { month: Month['id'] }

@Injectable()
export class MonthlyExpenseService implements BaseService<MonthlyExpenseDTO> {
  constructor(
    @Repo(MonthlyExpense) private repo: Repository<MonthlyExpense>,
    @Repo(Month) private monthRepo: Repository<Month>,
  ) {}

  async list({ month }: queries) {
    const query = this.repo
      .createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .addOrderBy('Expense.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => MonthlyExpense.toDTO(row)))
  }

  async get(id: MonthlyExpenseDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum gasto mensal encontrado.')

    return MonthlyExpense.toDTO(entity)
  }

  async post({ value, description, month }: body) {
    const repeated = await this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.month', 'Month')
      .where('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Este gasto mensal já foi cadastrado.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })
    
    const entity = this.repo.create({ value, description, month: monthEntity })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return MonthlyExpense.toDTO(entity)
  }

  async put(id: MonthlyExpenseDTO['id'], { value, description, month }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Gasto mensal não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.month', 'Month')
      .where('Expense.id != :id', { id })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Este gasto mensal já foi cadastrado.')

    entity.value = value
    entity.description = description

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyExpense.toDTO(entity)
  }

  async delete(id: MonthlyExpenseDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Gasto mensal não encontrado.')

    await this.repo.softRemove(entity)

    return MonthlyExpense.toDTO(entity)
  }
}
