import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TagDTO from '../Tag.dto';
import { Tag } from '../Tag';
import { User } from 'src/app/user/User';

type body = { name: string, color: string }

@Injectable()
export class TagService implements BaseService<TagDTO> {
  constructor(
    @Repo(Tag) private repo: Repository<Tag>,
    @Repo(User) private userRepo: Repository<User>,
  ) {}

  async list(user: User['id']) {
    const entitites = await this.repo.createQueryBuilder('Tag')
      .innerJoinAndSelect('Tag.user', 'User')
      .where('User.id = :user', { user })
      .getMany()

    return entitites.map(row => Tag.toDTO(row))
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

    await this.repo.softRemove(entity)

    return Tag.toDTO(entity)
  }
}
