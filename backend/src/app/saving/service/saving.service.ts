import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { Saving, savingStatus } from '../Saving';
import SavingDTO from '../Saving.dto';
import { User } from 'src/app/user/User';

type body = {
	title: string, 
	description?: string, 
	amount: number, 
	dueDate?: Date,
  status?: savingStatus
}

@Injectable()
export class SavingService implements BaseService<SavingDTO> {
  constructor(
    @Repo(Saving) private repo: Repository<Saving>,
    @Repo(User) private userRepo: Repository<User>,
  ) {}

  async list(user: User['id']) {
    const entitites = await this.repo.createQueryBuilder('Saving')
      .innerJoinAndSelect('Saving.user', 'User')
      .where('User.id = :user', { user })
      .getMany()

    return entitites.map(row => Saving.toDTO(row))
  }

  async get(user: User['id'], id: SavingDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Saving')
      .innerJoinAndSelect('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Nenhuma caixinha encontrada.')

    return Saving.toDTO(entity)
  }

  async post(user: User['id'], { title, description, amount, dueDate }: body) {
    const duplicated = await this.repo.createQueryBuilder('Saving')
      .innerJoin('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.title = :title', { title })
      .andWhere('Saving.dueDate = :dueDate', { dueDate })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta caixinha já existe.')
    
    const userEntity = await this.userRepo.findOneBy({ id: user })
    
    const entity = this.repo.create({ 
      title, 
      description,
      amount,
      dueDate,
      user: userEntity,
    })
    
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }

  async put(user: User['id'], id: SavingDTO['id'], { title, description, amount, dueDate }: body) {
    const duplicated = await this.repo.createQueryBuilder('Saving')
      .innerJoin('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.id != :id', { id })
      .andWhere('Saving.title = :title', { title })
      .andWhere('Saving.dueDate = :dueDate', { dueDate })
      .getOne()
    if(duplicated) throw DuplicatedException('Esta caixinha já existe.')
    
    const entity = await this.repo.createQueryBuilder('Saving')
      .innerJoin('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    entity.title = title
    entity.description = description
    entity.amount = amount
    entity.dueDate = dueDate

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }
  
  async updateStatus(user: User['id'], id: SavingDTO['id'], { status }: body) {
    const entity = await this.repo.createQueryBuilder('Saving')
      .innerJoin('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    entity.status = status

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }

  async delete(user: User['id'], id: SavingDTO['id']) {
    const entity = await this.repo.createQueryBuilder('Saving')
      .innerJoin('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.id = :id', { id })
      .getOne()
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    await this.repo.softRemove(entity)

    return Saving.toDTO(entity)
  }
}
