import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/shared/BaseService';
import YearDTO from '../Year.dto';
import { Year } from '../Year';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { year: number }

@Injectable()
export class YearService implements BaseService<YearDTO> {
  constructor(
    @Repo(Year) private readonly repo: Repository<Year>,
  ) {}

  async fetchAll({ year }) {
    const query = this.repo.createQueryBuilder('Year')
      .leftJoinAndSelect('Year.months', 'Month')
      .leftJoinAndSelect('Month.categories', 'Category')
      .leftJoinAndSelect('Month.entries', 'Entry')
      .leftJoinAndSelect('Category.groups', 'Group')
      .leftJoinAndSelect('Group.expenses', 'Expense')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .addOrderBy('Category.name', 'ASC')
      .addOrderBy('Group.name', 'ASC')
      .addOrderBy('Expense.date', 'DESC')

    if(year) query.where('Year.id = :year', { year })

    const entities = await query.getMany()

    return entities.map(row => Year.toDTO(row))
  }

  async list() {
    const entities = await this.repo.createQueryBuilder('Year')
      .leftJoinAndSelect('Year.months', 'Month')
      .orderBy('Year.year', 'DESC')
      .addOrderBy('Month.month', 'DESC')
      .getMany()

    return entities.map(row => Year.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum ano encontrado.')

    return Year.toDTO(entity)
  }

  async post({ year }: body) {
    const repeated = await this.repo.findOneBy({ year })
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')
    
    const entity = this.repo.create({ year })

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async put(id: string, { year }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Year')
      .where('Year.id != :id', { id })
      .andWhere('Year.year = :year', { year })
      .getOne()
    if(repeated) throw DuplicatedException('Este ano já foi cadastrado.')

    entity.year = year

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Year.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Ano não encontrado.')

    await this.repo.softRemove(entity)

    return Year.toDTO(entity)
  }
}
