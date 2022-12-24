import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { BaseService } from 'src/configs/BaseService';
import { dataSource } from 'src/configs/data-source';
import ExpenseDTO from 'src/DTOs/expense';
import { Expense } from 'src/entities/Expense';
import { Group } from 'src/entities/Group';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/utils/exceptions';

type body = { value: number, description: string, date: Date, group: string }
type query = { group: string }

@Injectable()
export class ExpenseService implements BaseService<Expense, ExpenseDTO> {
  repo = dataSource.getRepository(Expense)
  groupRepo = dataSource.getRepository(Group)

  async list({ group }: query) {
    const query = this.repo
      .createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.group', 'Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Expense.date', 'DESC')

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

  async put(id, { value, description, date, group }: body) {
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
