import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/configs/BaseService';
import { dataSource } from 'src/configs/data-source';
import MonthlyEntryDTO from 'src/DTOs/monthlyEntry';
import { Month } from 'src/entities/Month';
import { MonthlyEntry } from 'src/entities/MonthlyEntry';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

type body = { value: number, description: string, month: string }
type query = { month: string }

@Injectable()
export class MonthlyEntryService implements BaseService<MonthlyEntry, MonthlyEntryDTO> {
  repo = dataSource.getRepository(MonthlyEntry)
  monthRepo = dataSource.getRepository(Month)

  async list({ month }: query) {
    const query = this.repo
      .createQueryBuilder('Entry')
      .leftJoinAndSelect('Entry.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Entry.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })

    const entities = await query.getMany()

    return entities.map(row => MonthlyEntry.toDTO(row))
  }

  async get(id) {
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
    if(errors.length != 0) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return MonthlyEntry.toDTO(entity)
  }

  async put(id, { value, description, month }: body) {
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
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return MonthlyEntry.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro mensal não encontrado.')

    await this.repo.softRemove(entity)

    return MonthlyEntry.toDTO(entity)
  }
}
