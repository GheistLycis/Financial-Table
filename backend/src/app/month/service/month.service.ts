import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
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
    @Inject(YearService) private yearService: YearService,
    @Inject(MonthlyIncomeService) private monthlyIncomeService: MonthlyIncomeService,
    @Inject(MonthlyExpenseService) private monthlyExpenseService: MonthlyExpenseService,
    @Inject(CategoryService) private categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async list(user, { year }: queries) {
    const query = this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')

    if(year) query.where('Year.id = :year', { year })

    return await query.getMany().then(entities => entities.map(row => Month.toDTO(row)))
  }

  async get(id: MonthDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
  }

  async post(user, { month, available, obs, year }: body) {
    const duplicated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(duplicated) throw DuplicatedException('Este mês já existe.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })
    
    const entity = this.repo.create({ month, available, obs, year: yearEntity })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id: MonthDTO['id'], { month, available, obs, year }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    const duplicated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.id != :id', { id })
      .andWhere('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(duplicated) throw DuplicatedException('Este mês já existe.')

    entity.month = month
    entity.available = available
    entity.obs = obs

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id: MonthDTO['id']) {
    const entity = await this.repo.findOne({ 
      where: { id },
      relations: ['incomes', 'expenses', 'categories', 'categories.expenses']
    })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)
    
    await this.cacheService.reset()

    return Month.toDTO(entity)
  }
  
  async duplicate(id: MonthDTO['id'], { 
    duplicateMonthlyExpenses,
    duplicateMonthlyIncomes,
    duplicateCategories }: duplicationBody): Promise<MonthDTO> {
    const targetMonth = await this.repo.findOne({ 
      where: { id }, 
      relations: { year: true } 
    }).then(entity => Month.toDTO(entity))
    if(!targetMonth) throw NotFoundException('Mês não encontrado.')
    
    let newMonthNumber: number
    let yearDTO: YearDTO
    
    if(targetMonth.month < 12) {
      newMonthNumber = targetMonth.month + 1
      
      yearDTO = await this.yearService.get(null, targetMonth.year.id)
    }
    else {
      newMonthNumber = 1
      
      yearDTO = await this.yearRepo.findOneBy({ year: targetMonth.year.year + 1 })
        .then(year =>{
          if(year) {
            return this.yearService.get(null, year.id)
          }
          else {
            return this.yearService.post(null, { year: targetMonth.year.year + 1 })
          }
        })
        .then(year => year)
    }
    
    const newMonth = await this.post(null, {
      month: newMonthNumber,
      available: targetMonth.available, 
      obs: targetMonth.obs, 
      year: yearDTO.id,
    }).catch(err => {
      if(err?.code == 406) err.message = 'O mês seguinte já existe.'

      throw err
    })
    
    if(duplicateMonthlyIncomes) {
      const monthlyIncomes = await this.monthlyIncomeService.list(null, { month: targetMonth.id })
      monthlyIncomes.forEach(({ value, description }) => {
        this.monthlyIncomeService.post(null, {
          value,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateMonthlyExpenses) {
      const monthlyExpenses = await this.monthlyExpenseService.list(null, { month: targetMonth.id })
      monthlyExpenses.forEach(({ value, description }) => {
        this.monthlyExpenseService.post(null, {
          value,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateCategories) {
      const categories = await this.categoryService.list(null, { month: targetMonth.id })
      categories.forEach(({ name, color, percentage }) => {
        this.categoryService.post(null, {
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
