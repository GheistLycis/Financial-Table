import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectDataSource, InjectRepository as Repo } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import TagDTO from '../Tag.dto';
import { Tag } from '../Tag';
import { User } from 'src/app/user/User';
import ExpenseDTO from 'src/app/expense/Expense.dto';

type body = { name: string, color: string }
type queries = { expense?: ExpenseDTO['id'] }

@Injectable()
export class TagService implements BaseService<TagDTO> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(Tag) private repo: Repository<Tag>,
    @Repo(User) private userRepo: Repository<User>,
  ) {}

  async list(user: User['id'], { expense }: queries) {
    let entities: Tag[]
    
    if(expense) {
      entities = await this.dataSource.query(`
        SELECT t.*
        FROM tags t
        JOIN expenses_tags_tags ett ON ett."tagsId" = t.id
        JOIN users u ON u.id = t."userId"
        WHERE 
          u.id = ${user}
          AND ett."expensesId" = ${expense}
      `)
    }
    else {
      entities = await this.repo.createQueryBuilder('Tag')
        .innerJoin('Tag.user', 'User')
        .where('User.id = :user', { user })
        .getMany()
    }

    return entities.map(row => Tag.toDTO(row))
  }

  async get(user: User['id'], id: TagDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Tag')
      .innerJoinAndSelect('Tag.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Tag.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhuma tag encontrada.')

    return Tag.toDTO(entity)
  }

  async post(user: User['id'], { name, color }: body) {
    const duplicated = await this.repo.createQueryBuilder('Tag')
      .innerJoin('Tag.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Tag.name = :name', { name })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta tag já existe.')
    
    const userEntity = await this.userRepo.findOneBy({ id: user })
    
    const entity = this.repo.create({ 
      name, 
      color,
      user: userEntity,
    })
    
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Tag.toDTO(entity)
  }

  async put(user: User['id'], id: TagDTO['id'], { name, color }: body) {
    const duplicated = await this.repo.createQueryBuilder('Tag')
      .innerJoin('Tag.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Tag.id != :id', { id })
      .andWhere('Tag.name = :name', { name })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta tag já existe.')
  
    const entity = await this.repo.createQueryBuilder('Tag')
      .innerJoin('Tag.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Tag.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Tag não encontrada.')

    entity.name = name
    entity.color = color

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Tag.toDTO(entity)
  }

  async delete(user: User['id'], id: TagDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Tag')
      .innerJoin('Tag.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Tag.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Tag não encontrada.')

    await this.repo.remove(entity)

    return Tag.toDTO(entity)
  }
}
