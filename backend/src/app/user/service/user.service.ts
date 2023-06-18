import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/BaseService';
import UserDTO from '../User.dto';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { User } from '../User';
import { DuplicatedException, NotFoundException, classValidatorError } from 'src/shared/GlobalExceptions';
import { validate } from 'class-validator';

type body = { name: string }

@Injectable()
export class UserService implements BaseService<UserDTO> {
  constructor(
    @Repo(User) private readonly repo: Repository<User>,
  ) {}
  
  async list() {
    const query = this.repo.createQueryBuilder('User')
      .orderBy('User.createdAt', 'DESC')

    const entities = await query.getMany()

    return entities.map(row => User.toDTO(row))
  }

  async get(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum usuário encontrado.')

    return User.toDTO(entity)
  }

  async post({ name }: body) {
    const repeated = await this.repo.createQueryBuilder('User')
      .where('User.name = :name', { name })
      .getOne()
    if(repeated) throw DuplicatedException('Este nome de usuário já foi cadastrado.')
    
    const entity = this.repo.create({ name })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return User.toDTO(entity)
  }

  async put(id: string, { name }: body) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    const repeated = await this.repo.createQueryBuilder('User')
      .where('User.id != :id', { id })
      .andWhere('User.name = :name', { name })
      .getOne()
    if(repeated) throw DuplicatedException('Este nome de usuário já foi cadastrado.')

    entity.name = name

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return User.toDTO(entity)
  }

  async delete(id: string) {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    await this.repo.softRemove(entity)

    return User.toDTO(entity)
  }
}
