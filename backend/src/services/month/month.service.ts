import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { dataSource } from 'src/database/data-source';
import MonthDTO from 'src/DTOs/month';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { month: number, income: number, year: string }
export type query = { year: string }
export type oneReturn = Promise<MonthDTO>
export type manyReturn = Promise<MonthDTO[]>

@Injectable()
export class MonthService {
  repo = dataSource.getRepository(Month)
  yearRepo = dataSource.getRepository(Year)

  async list({ year }: query): manyReturn {
    const query = this.repo
      .createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Month.month', 'DESC')

    if(year) query.where('Year.id = :year', { year })

    const entities = await query.getMany()

    return entities.map(row => Month.toDTO(row))
  }

  async get(id: string): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
  }

  async post({ month, income, year }: body): oneReturn {
    const repeated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })
    
    const entity = this.repo.create({ month, income, year: yearEntity })
      
    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id: string, { month, income, year }: body): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })

    entity.month = month
    entity.income = income
    entity.year = yearEntity

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id: string): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)

    return Month.toDTO(entity)
  }
}
