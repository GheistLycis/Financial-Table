import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/BaseService';
import UserDTO from '../User.dto';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { User } from '../User';
import { DuplicatedException, NotFoundException, classValidatorError } from 'src/shared/globalExceptions';
import { validate } from 'class-validator';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Session } from 'src/shared/Session';

type body = { name: string }

@Injectable()
export class UserService implements BaseService<UserDTO> {
  constructor(
    @Repo(User) private repo: Repository<User>,
    private authService: AuthService,
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
  
  async logIn(name: string): Promise<Session> {
    const entity = await this.repo.findOneBy({ name })
    if(!entity) throw NotFoundException('Nenhum usuário encontrado.')
    
    const token = await this.authService.generateToken(entity.id, name)

    return { user: User.toDTO(entity), token }
  }
}
