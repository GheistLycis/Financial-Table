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
import { User } from 'src/app/user/User';
import GlobalException from 'src/shared/classes/GlobalException';

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

  async list(user: User['id'], { year }: queries) {
    const query = this.repo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })

    if(year) query.andWhere('Year.id = :year', { year })

    return await query.getMany().then(entities => entities.map(row => Month.toDTO(row)))
  }

  async get(user: User['id'], id: MonthDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
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
    
    entity = await this.repo.findOne({ 
      where: { id },
      relations: [
        'incomes', 
        'expenses', 
        'categories', 'categories.expenses'
      ]
    })

    await this.repo.softRemove(entity)
    
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
      
      monthlyIncomes.forEach(({ value, description }) => {
        this.monthlyIncomeService.post(user, {
          value,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateMonthlyExpenses) {
      const monthlyExpenses = await this.monthlyExpenseService.list(user, { month: targetMonth.id })
      
      monthlyExpenses.forEach(({ value, description }) => {
        this.monthlyExpenseService.post(user, {
          value,
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
