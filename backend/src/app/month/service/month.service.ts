import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import MonthDTO from '../Month.dto';
import { Month } from '../Month';
import { Year } from '../../year/Year'
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { YearService } from 'src/app/year/service/year.service';
import { MonthlyIncomeService } from 'src/app/monthly-income/service/monthly-income.service';
import { MonthlyExpenseService } from 'src/app/monthly-expense/service/monthly-expense.service';
import { CategoryService } from 'src/app/category/service/category.service';
import { GroupService } from 'src/app/group/service/group.service';
import YearDTO from 'src/app/year/Year.dto';
import CategoryDTO from 'src/app/category/Category.dto';

type body = { month: number, available: number, obs: string, year: string }
type queries = { year: string }
type duplicateQueries = { 
  duplicateMonthlyExpenses: 'true' | 'false',
  duplicateMonthlyIncomes: 'true' | 'false',
  duplicateCategories: 'true' | 'false',
  duplicateGroups: 'true' | 'false',
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
    @Inject(GroupService) private groupService: GroupService,
  ) {}

  async list({ year }: queries) {
    const query = this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')

    if(year) query.where('Year.id = :year', { year })

    return await query.getMany().then(entities => entities.map(row => Month.toDTO(row)))
  }

  async get(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
  }

  async post({ month, available, obs, year }: body) {
    const repeated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })
    
    const entity = this.repo.create({ month, available, obs, year: yearEntity })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id: string, { month, available, obs, year }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.id != :id', { id })
      .andWhere('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })

    entity.month = month
    entity.available = available
    entity.obs = obs
    entity.year = yearEntity

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)

    return Month.toDTO(entity)
  }
  
  async duplicate(id: string, { duplicateMonthlyExpenses, duplicateMonthlyIncomes, duplicateCategories, duplicateGroups }: duplicateQueries): Promise<MonthDTO> {
    const targetMonth = await this.repo.findOne({ 
      where: { id }, 
      relations: { year: true } 
    }).then(entity => Month.toDTO(entity))
    if(!targetMonth) throw NotFoundException('Mês não encontrado.')
    
    let newMonthNumber: number
    let yearDTO: YearDTO
    
    if(targetMonth.month < 12) {
      newMonthNumber = targetMonth.month + 1
      
      yearDTO = await this.yearService.get(targetMonth.year.id)
    }
    else {
      newMonthNumber = 1
      
      yearDTO = await this.yearRepo.findOneBy({ year: targetMonth.year.year + 1 })
        .then(year =>{
          if(year) {
            return this.yearService.get(year.id)
          }
          else {
            return this.yearService.post({ year: targetMonth.year.year + 1 })
          }
        })
        .then(year => year)
    }
    
    const newMonth = await this.post({
      month: newMonthNumber,
      available: targetMonth.available, 
      obs: targetMonth.obs, 
      year: yearDTO.id,
    }).catch(err => {
      if(err?.code == 406) err.message = 'O mês seguinte já existe.'

      throw err
    })
    
    if(duplicateMonthlyIncomes == 'true') {
      const monthlyIncomes = await this.monthlyIncomeService.list({ month: targetMonth.id })
      monthlyIncomes.forEach(({ value, description }) => {
        this.monthlyIncomeService.post({
          value,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateMonthlyExpenses == 'true') {
      const monthlyExpenses = await this.monthlyExpenseService.list({ month: targetMonth.id })
      monthlyExpenses.forEach(({ value, description }) => {
        this.monthlyExpenseService.post({
          value,
          description,
          month: newMonth.id,
        })
      })
    }
    if(duplicateCategories == 'true') {
      const targetCategories = await this.categoryService.list({ month: targetMonth.id })
      const newCategories: CategoryDTO[] = []
      for(let i = 0; i < targetCategories.length; i++) {
        const { name, color, percentage } = targetCategories[i]
        const newCategory = await this.categoryService.post({
          name,
          percentage,
          color,
          month: newMonth.id,
        })
        
        newCategories.push(newCategory)
      }
      
      if(duplicateGroups == 'true') {
        const groups = await this.groupService.list({ month: targetMonth.id, category: '' })
        groups.forEach(({ name, color, category }) => {
          const { id } = newCategories.find(({ name }) => name == category.name)
          
          this.groupService.post({
            name,
            color,
            category: id,
          })
        })
      }
    }
    
    return newMonth
  }
}
