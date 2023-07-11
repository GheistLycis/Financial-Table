import { Injectable } from '@nestjs/common';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import BaseService from 'src/shared/interfaces/BaseService';
import { classValidatorError, DuplicatedException, NotFoundException } from 'src/filters/globalExceptions';
import { Repository } from 'typeorm';
import { Saving, savingStatus } from '../Saving';
import SavingDTO from '../Saving.dto';
import UserDTO from 'src/app/user/User.dto';
import { User } from 'src/app/user/User';

type body = {
	title: string, 
	description?: string, 
	amount: number, 
	dueDate?: Date,
	status: savingStatus
  user: UserDTO['id']
}

@Injectable()
export class SavingService implements BaseService<SavingDTO> {
  constructor(
    @Repo(Saving) private repo: Repository<Saving>,
    @Repo(User) private userRepo: Repository<User>,
  ) {}

  async list() {
    const query = this.repo.createQueryBuilder('Saving')
      .leftJoinAndSelect('Saving.user', 'User')

    return await query.getMany().then(entities => entities.map(row => Saving.toDTO(row)))
  }

  async get(id: SavingDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhuma caixinha encontrada.')

    return Saving.toDTO(entity)
  }

  async post({ title, description, amount, dueDate, status, user }: body) {
    const repeated = await this.repo.createQueryBuilder('Saving')
      .leftJoinAndSelect('Saving.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Saving.title = :title', { title })
      .andWhere('Saving.dueDate = :dueDate', { dueDate })
      .getOne()
    if(repeated) throw DuplicatedException('Esta caixinha já foi cadastrada.')

    const userEntity = await this.userRepo.findOneBy({ id: user })
    
    const entity = this.repo.create({ 
      title,
      description,
      amount,
      dueDate,
      status,
      user: userEntity,
    })

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
      
    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }

  async put(id: SavingDTO['id'], { title, description, amount, dueDate, status, user }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    const repeated = await this.repo.createQueryBuilder('Saving')
      .where('Saving.id != :id', { id })
      .andWhere('Saving.title = :title', { title })
      .andWhere('Saving.dueDate = :dueDate', { dueDate })
      .getOne()
    if(repeated) throw DuplicatedException('Esta caixinha já foi cadastrada.')

    const userEntity = await this.userRepo.findOneBy({ id: user })

    entity.title = title
    entity.description = description
    entity.amount = amount
    entity.dueDate = dueDate
    entity.status = status
    entity.user = userEntity

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }
  
  async updateStatus(id: SavingDTO['id'], { status }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    entity.status = status

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return Saving.toDTO(entity)
  }

  async delete(id: SavingDTO['id']) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Caixinha não encontrada.')

    await this.repo.softRemove(entity)

    return Saving.toDTO(entity)
  }
}
