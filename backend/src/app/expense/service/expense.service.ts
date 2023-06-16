import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/shared/BaseService';
import ExpenseDTO from '../Expense.dto';
import { Expense } from '../Expense';
import { Group } from '../../group/Group';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { value: number, description: string, date: Date, group: string }
type queries = { month: string, category: string, group: string }

@Injectable()
export class ExpenseService implements BaseService<ExpenseDTO> {
  constructor(
    @Repo(Expense) private readonly repo: Repository<Expense>,
    @Repo(Group) private readonly groupRepo: Repository<Group>,
  ) {}

  async list({ month, category, group }: queries) {
    const query = this.repo
      .createQueryBuilder('Expense')
      .leftJoin('Expense.group', 'Group')
      .leftJoin('Group.category', 'Category')
      .leftJoin('Category.month', 'Month')
      .leftJoin('Month.year', 'Year')
      .orderBy('Expense.date', 'DESC')

    if(month) query.where('Month.id = :month', { month })
    if(category) query.where('Category.id = :category', { category })
    if(group) query.where('Group.id = :group', { group })

    const entities = await query.getMany()

    return entities.map(row => Expense.toDTO(row))
  }

  async get(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum registro encontrado.')

    return Expense.toDTO(entity)
  }

  async post({ value, description, date, group }: body) {
    const repeated = await this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.group', 'Group')
      .where('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .andWhere('Group.id = :group', { group })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro já foi cadastrado.')

    const groupEntity = await this.groupRepo.findOneBy({ id: group })
    
    const entity = this.repo.create({ 
      value, 
      description, 
      date,
      group: groupEntity
    })

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Expense.toDTO(entity)
  }

  async put(id: string, { value, description, date, group }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.group', 'Group')
      .where('Expense.id != :id', { id })
      .andWhere('Expense.value = :value', { value })
      .andWhere('Expense.description = :description', { description })
      .andWhere('Expense.date = :date', { date })
      .andWhere('Group.id = :group', { group })
      .getOne()
    if(repeated) throw DuplicatedException('Este registro já foi cadastrado.')

    const groupEntity = await this.groupRepo.findOneBy({ id: group })

    entity.value = value
    entity.description = description
    entity.date = date
    entity.group = groupEntity

    const errors = await validate(entity)
    if(errors.length != 0) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Expense.toDTO(entity)
  }

  async delete(id) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    await this.repo.softRemove(entity)

    return Expense.toDTO(entity)
  }
}
