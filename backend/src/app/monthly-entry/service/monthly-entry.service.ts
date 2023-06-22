import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import MonthlyEntryDTO from '../MonthlyEntry.dto';
import { Month } from '../../month/Month';
import { MonthlyEntry } from '../MonthlyEntry';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { value: number, description: string, month: string }
type queries = { month: string }

@Injectable()
export class MonthlyEntryService implements BaseService<MonthlyEntryDTO> {
  constructor(
    @Repo(MonthlyEntry) private repo: Repository<MonthlyEntry>,
    @Repo(Month) private monthRepo: Repository<Month>,
  ) {}

  async list({ month }: queries) {
    const query = this.repo
      .createQueryBuilder('Entry')
      .leftJoinAndSelect('Entry.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Entry.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    return await query.getMany().then(entities => entities.map(row => MonthlyEntry.toDTO(row)))
  }

  async get(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum registro mensal encontrado.')

    return MonthlyEntry.toDTO(entity)
  }

  async post({ value, description, month }: body) {
    const repeated = await this.repo.createQueryBuilder('Entry')
      .leftJoinAndSelect('Entry.month', 'Month')
      .where('Entry.value = :value', { value })
      .andWhere('Entry.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro mensal já foi cadastrado.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })
    
    const entity = this.repo.create({ value, description, month: monthEntity })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return MonthlyEntry.toDTO(entity)
  }

  async put(id: string, { value, description, month }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro mensal não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Entry')
      .leftJoinAndSelect('Entry.month', 'Month')
      .where('Entry.id != :id', { id })
      .andWhere('Entry.value = :value', { value })
      .andWhere('Entry.description = :description', { description })
      .andWhere('Month.id = :month', { month })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro mensal já foi cadastrado.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month })

    entity.value = value
    entity.description = description
    entity.month = monthEntity

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyEntry.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro mensal não encontrado.')

    await this.repo.softRemove(entity)

    return MonthlyEntry.toDTO(entity)
  }
}
