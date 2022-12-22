import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import CategoryDTO from 'src/DTOs/category';
import ExpenseDTO from 'src/DTOs/expense';
import GroupDTO from 'src/DTOs/group';
import { Category } from 'src/entities/Category';
import { Expense } from 'src/entities/Expense';
import { Group } from 'src/entities/Group';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { name: string, color: string, category: CategoryDTO, expenses: ExpenseDTO[] }

@Injectable()
export class GroupService {
  repo = dataSource.getRepository(Group)
  categoryRepo = dataSource.getRepository(Category)
  expenseRepo = dataSource.getRepository(Expense)

  async list(): Promise<GroupDTO[]> {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Group.toDTO(row))
  }

  async listByCategory(id): Promise<GroupDTO[]> {
    const entities = await this.repo.createQueryBuilder('Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .where('Category.id = :id', { id })
      .orderBy('Group.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Group.toDTO(row))
  }

  async getById(id): Promise<GroupDTO> {
    const entity = await this.repo.findOneBy({ id })

    return Group.toDTO(entity)
  }

  async post(body: body): Promise<GroupDTO> {
    const { name, color, category, expenses } = body

    const repeated = await this.repo.findOneBy({ name })
    if(repeated) throw DuplicatedException('Este grupo já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category.id })

    const expenseEntities = await this.expenseRepo.createQueryBuilder('Expense')
      .where('Expense.id IN :ids', { ids: expenses.map(expense => expense.id) })
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

  async put(id, body: body): Promise<GroupDTO> {
    const { name, color, category, expenses } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category.id })

    const expenseEntities = await this.expenseRepo.createQueryBuilder('Expense')
      .where('Expense.id IN :ids', { ids: expenses.map(expense => expense.id) })
      .getMany()

    entity.name = name
    entity.color = color
    entity.category = categoryEntity
    entity.expenses = expenseEntities

    await this.repo.save(entity)

    return Group.toDTO(entity)
  }

  async delete(id): Promise<GroupDTO> {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    await this.repo.softRemove(entity)

    return Group.toDTO(entity)
  }
}
