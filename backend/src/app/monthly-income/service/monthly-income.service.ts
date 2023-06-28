import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import MonthlyIncomeDTO from '../MonthlyIncome.dto';
import { Month } from '../../month/Month';
import { MonthlyIncome } from '../MonthlyIncome';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { value: number, description: string, month: string }
type queries = { month: string }

@Injectable()
export class MonthlyIncomeService implements BaseService<MonthlyIncomeDTO> {
  constructor(
    @Repo(MonthlyIncome) private repo: Repository<MonthlyIncome>,
    @Repo(Month) private monthRepo: Repository<Month>,
  ) {}

  async list({ month }: queries) {
    const query = this.repo
      .createQueryBuilder('Income')
      .leftJoinAndSelect('Income.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .addOrderBy('Income.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => MonthlyIncome.toDTO(row)))
  }

  async get(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhuma entrada mensal encontrada.')

    return MonthlyIncome.toDTO(entity)
  }

  async post({ value, description, month }: body) {
    const repeated = await this.repo.createQueryBuilder('Income')
      .leftJoinAndSelect('Income.month', 'Month')
      .where('Income.value = :value', { value })
      .andWhere('Income.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Esta entrada mensal já foi cadastrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })
    
    const entity = this.repo.create({ value, description, month: monthEntity })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return MonthlyIncome.toDTO(entity)
  }

  async put(id: string, { value, description, month }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Entrada mensal não encontrada.')

    const repeated = await this.repo.createQueryBuilder('Income')
      .leftJoinAndSelect('Income.month', 'Month')
      .where('Income.id != :id', { id })
      .andWhere('Income.value = :value', { value })
      .andWhere('Income.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Esta entrada mensal já foi cadastrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })

    entity.value = value
    entity.description = description
    entity.month = monthEntity

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyIncome.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Entrada mensal não encontrada.')

    await this.repo.softRemove(entity)

    return MonthlyIncome.toDTO(entity)
  }
}
