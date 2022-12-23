import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import GroupDTO from 'src/DTOs/group';
import { Category } from 'src/entities/Category';
import { Expense } from 'src/entities/Expense';
import { Group } from 'src/entities/Group';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { name: string, color: string, category: string, expenses: string[] }
export type oneReturn = Promise<GroupDTO>
export type manyReturn = Promise<GroupDTO[]>

@Injectable()
export class GroupService {
  repo = dataSource.getRepository(Group)
  categoryRepo = dataSource.getRepository(Category)
  expenseRepo = dataSource.getRepository(Expense)

  async list(): manyReturn {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Group.toDTO(row))
  }

  async listByCategory(id): manyReturn {
    const entities = await this.repo.createQueryBuilder('Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .where('Category.id = :id', { id })
      .orderBy('Group.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Group.toDTO(row))
  }

  async getById(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })

    return Group.toDTO(entity)
  }

  async post(body: body): oneReturn {
    const { name, color, category, expenses } = body

    const repeated = await this.repo.findOneBy({ name })
    if(repeated) throw DuplicatedException('Este grupo já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })

    const expenseEntities = await this.expenseRepo.createQueryBuilder('Expense')
      .where('Expense.id IN :expenses', { expenses })
      .getMany()
    
    const entity = this.repo.create({ 
      name, 
      color, 
      category: categoryEntity, 
      expenses: expenseEntities
    })
      
    await this.repo.save(entity)

    return Group.toDTO(entity)
  }

  async put(id, body: body): oneReturn {
    const { name, color, category, expenses } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })

    const expenseEntities = await this.expenseRepo.createQueryBuilder('Expense')
      .where('Expense.id IN :expenses', { expenses })
      .getMany()

    entity.name = name
    entity.color = color
    entity.category = categoryEntity
    entity.expenses = expenseEntities

    await this.repo.save(entity)

    return Group.toDTO(entity)
  }

  async delete(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    await this.repo.softRemove(entity)

    return Group.toDTO(entity)
  }
}
