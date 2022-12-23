import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import ExpenseDTO from 'src/DTOs/expense';
import { Expense } from 'src/entities/Expense';
import { Group } from 'src/entities/Group';
import { NotFoundException } from 'src/utils/exceptions';

export type body = { value: number, description: string, date: Date, group: string }
export type oneReturn = Promise<ExpenseDTO>
export type manyReturn = Promise<ExpenseDTO[]>

@Injectable()
export class ExpenseService {
  repo = dataSource.getRepository(Expense)
  groupRepo = dataSource.getRepository(Group)

  async list(): manyReturn {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Expense.toDTO(row))
  }

  async listByGroup(id): manyReturn {
    const entities = await this.repo.createQueryBuilder('Expense')
      .leftJoinAndSelect('Expense.group', 'Group')
      .where('Group.id = :id', { id })
      .orderBy('Expense.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Expense.toDTO(row))
  }

  async getById(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })

    return Expense.toDTO(entity)
  }

  async post(body: body): oneReturn {
    const { value, description, date, group } = body

    const groupEntity = await this.groupRepo.findOneBy({ id: group })
    
    const entity = this.repo.create({ 
      value, 
      description, 
      date,
      group: groupEntity
    })
      
    await this.repo.save(entity)

    return Expense.toDTO(entity)
  }

  async put(id, body: body): oneReturn {
    const { value, description, date, group } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    const groupEntity = await this.groupRepo.findOneBy({ id: group })

    entity.value = value
    entity.description = description
    entity.date = date
    entity.group = groupEntity

    await this.repo.save(entity)

    return Expense.toDTO(entity)
  }

  async delete(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Registro não encontrado.')

    await this.repo.softRemove(entity)

    return Expense.toDTO(entity)
  }
}
