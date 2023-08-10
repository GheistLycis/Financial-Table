import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from '@interfaces/BaseService';
import MonthDTO from '../Month.dto';
import { Month } from '../Month';
import { Year } from '../../year/Year'
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { YearService } from 'src/app/year/service/year.service';
import { MonthlyIncomeService } from 'src/app/monthly-income/service/monthly-income.service';
import { MonthlyExpenseService } from 'src/app/monthly-expense/service/monthly-expense.service';
import { CategoryService } from 'src/app/category/service/category.service';
import YearDTO from 'src/app/year/Year.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/app/user/User';
import GlobalException from '@classes/GlobalException';
import { MonthNames } from '@enums/MonthNames';

type body = { month: number, available: number, obs: string, year: Year['id'] }
type queries = { year: Year['id'] }
type duplicationBody = { 
  duplicateMonthlyExpenses: boolean
  duplicateMonthlyIncomes: boolean
  duplicateCategories: boolean
}

@Injectable()
export class MonthService implements BaseService<MonthDTO> {
  constructor(
    @Repo(Year) private yearRepo: Repository<Year>,
    @Repo(Month) private repo: Repository<Month>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private yearService: YearService,
    private monthlyIncomeService: MonthlyIncomeService,
    private monthlyExpenseService: MonthlyExpenseService,
    private categoryService: CategoryService,
  ) {}

  async list(user: User['id'], { year }: queries) {
    const query = this.repo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })

    if(year) query.andWhere('Year.id = :year', { year })

    return await query.getMany().then(entities => entities.map(row => Month.toDTO(row)))
  }

  async get(user: User['id'], id: MonthDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
  }

  async getCSV(user: User['id']): Promise<string> {
    const entities = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.incomes', 'Income')
      .leftJoinAndSelect('Month.expenses', 'Expense')
      .leftJoinAndSelect('Month.categories', 'Category')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .getMany()

    return entities.reduce((acc, { year, month, incomes, expenses, categories }) => {
      let str = ''
      
      str += `${year.year};`
      str += `${MonthNames[month]};`
      str += `${incomes.map(({ value, description, date }) => `R$${value}${date ? ' (Dia ' + new Date(date).getDate() +')' : ''}${description ? ': ' + description : ''}`).join(', ')};`
      str += `${expenses.map(({ value, description, date }) => `R$${value}${date ? ' (Dia ' + new Date(date).getDate() +')' : ''}${description ? ': ' + description : ''}`).join(', ')};`
      str += `${categories.map(({ name }) => name).join(', ')}\n`
      
      return acc += str
      }, 'Ano;Mês;Entradas;Mensalidades;Categorias\n')
  }

  async post(user: User['id'], { month, available, obs, year }: body) {
    const duplicated = await this.repo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.year = :year', { year })
      .andWhere('Month.month = :month', { month })
      .getOne()
    if(duplicated) throw DuplicatedException('Este mês já existe.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })
    
    const entity = this.repo.create({ 
      month, 
      available, 
      obs, 
      year: yearEntity 
    })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(user: User['id'], id: MonthDTO['id'], { month, available, obs, year }: body) {
    const duplicated = await this.repo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id != :id', { id })
      .andWhere('Year.year = :year', { year })
      .andWhere('Month.month = :month', { month })
      .getOne()
    if(duplicated) throw DuplicatedException('Este mês já existe.')
  
    const entity = await this.repo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Mês não encontrado.')

    entity.month = month
    entity.available = available
    entity.obs = obs

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(user: User['id'], id: MonthDTO['id']) {
    let entity = await this.repo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Mês não encontrado.')
    
    entity = await this.repo.findOneBy({ id })

    await this.repo.remove(entity)
    
    await this.cacheService.reset()

    return Month.toDTO(entity)
  }
  
  async duplicate(user: User['id'], id: MonthDTO['id'], { 
    duplicateMonthlyExpenses,
    duplicateMonthlyIncomes,
    duplicateCategories }: duplicationBody
  ): Promise<MonthDTO> {
    const entity = await this.repo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Mês não encontrado.')
    
    const targetMonth = Month.toDTO(entity)
    let newMonthNumber: number
    let yearDTO: YearDTO
    
    if(targetMonth.month < 12) {
      newMonthNumber = targetMonth.month + 1
      
      yearDTO = await this.yearService.get(user, targetMonth.year.id)
    }
    else {
      newMonthNumber = 1
      
      yearDTO = await this.yearRepo.createQueryBuilder('Year')
        .innerJoin('Year.user', 'User')
        .where('User.id = :user', { user })
        .andWhere('Year.year = :year', { year: targetMonth.year.year + 1 })
        .getOne()
        .then(year => year
          ? Year.toDTO(year)
          : this.yearService.post(user, { year: targetMonth.year.year + 1 })
        )
    }
    
    const newMonth = await this.post(user, {
      month: newMonthNumber,
      available: targetMonth.available, 
      obs: targetMonth.obs, 
      year: yearDTO.id,
    }).catch((err: GlobalException | Error) => {
      if(err instanceof GlobalException && err.status == 406) err.message = 'O mês seguinte já existe.'

      throw err
    })
    
    if(duplicateMonthlyIncomes) {
      const monthlyIncomes = await this.monthlyIncomeService.list(user, { month: targetMonth.id })
      
      monthlyIncomes.forEach(({ value, date, description }) => {
        if(date) date = new Date(yearDTO.year, newMonth.month-1, new Date(date).getDate()+1)
        
        this.monthlyIncomeService.post(user, {
          value,
          date,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateMonthlyExpenses) {
      const monthlyExpenses = await this.monthlyExpenseService.list(user, { month: targetMonth.id })
      
      monthlyExpenses.forEach(({ value, date, description }) => {
        if(date) date = new Date(yearDTO.year, newMonth.month-1, new Date(date).getDate()+1)
        
        this.monthlyExpenseService.post(user, {
          value,
          date,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateCategories) {
      const categories = await this.categoryService.list(user, { month: targetMonth.id })
      
      categories.forEach(({ name, color, percentage }) => {
        this.categoryService.post(user, {
          name,
          color,
          percentage,
          month: newMonth.id,
        })
      })
    }
    
    return newMonth
  }
}
