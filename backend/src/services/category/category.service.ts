import { Injectable } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import CategoryDTO from 'src/DTOs/category';
import GroupDTO from 'src/DTOs/group';
import MonthDTO from 'src/DTOs/month';
import { Category } from 'src/entities/Category';
import { Group } from 'src/entities/Group';
import { Month } from 'src/entities/Month';
import { DuplicatedException, NotFoundException } from 'src/utils/exceptions';

export type body = { name: string, color: string, month: MonthDTO, groups: GroupDTO[] }
export type oneReturn =  Promise<CategoryDTO>
export type manyReturn =  Promise<CategoryDTO[]>

@Injectable()
export class CategoryService {
  repo = dataSource.getRepository(Category)
  monthRepo = dataSource.getRepository(Month)
  groupRepo = dataSource.getRepository(Group)

  async list(): manyReturn {
    const entities = await this.repo.find({ order: { createdAt: 'DESC' }})

    return entities.map(row => Category.toDTO(row))
  }

  async listByMonth(id): manyReturn {
    const entities = await this.repo.createQueryBuilder('Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .where('Month.id = :id', { id })
      .orderBy('Category.createdAt', 'DESC')
      .getMany()

    return entities.map(row => Category.toDTO(row))
  }

  async getById(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })

    return Category.toDTO(entity)
  }

  async post(body: body): oneReturn {
    const { name, color, month, groups } = body

    const repeated = await this.repo.findOneBy({ name })
    if(repeated) throw DuplicatedException('Esta categoria já foi cadastrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month.id })

    const groupEntities = await this.groupRepo.createQueryBuilder('Group')
      .where('Group.id IN :ids', { ids: groups.map(group => group.id) })
      .getMany()
    
    const entity = this.repo.create({ 
      name, 
      color, 
      month: monthEntity, 
      groups: groupEntities
    })
      
    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async put(id, body: body): oneReturn {
    const { name, color, month, groups } = body
  
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    const monthEntity = await this.monthRepo.findOneBy({ id: month.id })

    const groupEntities = await this.groupRepo.createQueryBuilder('Group')
      .where('Group.id IN :ids', { ids: groups.map(group => group.id) })
      .getMany()

    entity.name = name
    entity.color = color
    entity.month = monthEntity
    entity.groups = groupEntities

    await this.repo.save(entity)

    return Category.toDTO(entity)
  }

  async delete(id): oneReturn {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Categoria não encontrada.')

    await this.repo.softRemove(entity)

    return Category.toDTO(entity)
  }
}
