import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/configs/BaseService';
import { dataSource } from 'src/configs/data-source';
import MonthDTO from 'src/DTOs/month';
import { Month } from 'src/entities/Month';
import { Year } from 'src/entities/Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

type body = { month: number, obs: string, year: string }
type queries = { year: string }

@Injectable()
export class MonthService implements BaseService<Month, MonthDTO> {
  repo = dataSource.getRepository(Month)
  yearRepo = dataSource.getRepository(Year)

  async list({ year }: queries) {
    const query = this.repo
      .createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Month.month', 'DESC')

    if(year) query.where('Year.id = :year', { year })

    const entities = await query.getMany()

    return entities.map(row => Month.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum mês encontrado.')

    return Month.toDTO(entity)
  }

  async post({ month, obs, year }: body) {
    const repeated = await this.repo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.month = :month', { month })
      .andWhere('Year.id = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este mês já foi cadastrado.')

    const yearEntity = await this.yearRepo.findOneBy({ id: year })
    
    const entity = this.repo.create({ month, obs, year: yearEntity })
      
    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async put(id, { month, obs, year }: body) {
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
    entity.obs = obs
    entity.year = yearEntity

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Month.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Mês não encontrado.')

    await this.repo.softRemove(entity)

    return Month.toDTO(entity)
  }
}
