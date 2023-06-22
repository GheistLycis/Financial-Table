import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import GroupDTO from '../Group.dto';
import { Category } from '../../category/Category';
import { Group } from '../../group/Group';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/shared/functions/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type body = { name: string, color: string, category: string }
type queries = { month: string, category: string }

@Injectable()
export class GroupService implements BaseService<GroupDTO> {
  constructor(
    @Repo(Group) private repo: Repository<Group>,
    @Repo(Category) private categoryRepo: Repository<Category>,
  ) {}

  async list({ month, category }: queries) {
    const query = this.repo.createQueryBuilder('Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .leftJoinAndSelect('Category.month', 'Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .orderBy('Group.createdAt', 'DESC')

    if(month) query.where('Month.id = :month', { month })
    if(category) query.where('Category.id = :category', { category })

    const entities = await query.getMany()

    return entities.map(row => Group.toDTO(row))
  }

  async get(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum grupo encontrado.')

    return Group.toDTO(entity)
  }

  async post({ name, color, category }: body) {
    const repeated = await this.repo.createQueryBuilder('Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .where('Group.name = :name', { name })
      .andWhere('Category.id = :category', { category })
      .getOne()
    if(repeated) throw DuplicatedException('Este grupo já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })
    
    const entity = this.repo.create({ 
      name, 
      color, 
      category: categoryEntity, 
    })
      
    await this.repo.save(entity)

    return Group.toDTO(entity)
  }

  async put(id: string, { name, color, category }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    const repeated = await this.repo.createQueryBuilder('Group')
      .leftJoinAndSelect('Group.category', 'Category')
      .where('Group.id != :id', { id })
      .andWhere('Group.name = :name', { name })
      .andWhere('Category.id = :category', { category })
      .getOne()
    if(repeated) throw DuplicatedException('Este grupo já foi cadastrado.')

    const categoryEntity = await this.categoryRepo.findOneBy({ id: category })

    entity.name = name
    entity.color = color
    entity.category = categoryEntity

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Group.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Grupo não encontrado.')

    await this.repo.softRemove(entity)

    return Group.toDTO(entity)
  }
}
