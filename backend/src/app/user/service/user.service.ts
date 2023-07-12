import { Injectable } from '@nestjs/common';
import UserDTO from '../User.dto';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { User } from '../User';
import { DuplicatedException, ForbiddenException, NotFoundException, UnauthorizedException, classValidatorError } from 'src/filters/globalExceptions';
import { validate } from 'class-validator';
import { AuthService } from 'src/app/auth/service/auth.service';
import Session from 'src/shared/interfaces/Session';
import * as bcrypt from 'bcrypt';

type body = { name: string, email: string, password: string }

@Injectable()
export class UserService {
  constructor(
    @Repo(User) private repo: Repository<User>,
    private authService: AuthService,
  ) {}
  
  async list(): Promise<UserDTO[]> {
    const query = this.repo.createQueryBuilder('User')

    return await query.getMany().then(entities => entities.map(row => User.toDTO(row)))
  }

  async get(id: UserDTO['id']): Promise<UserDTO> {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum usuário encontrado.')

    return User.toDTO(entity)
  }

  async put(id: UserDTO['id'], { name }: body): Promise<UserDTO> {
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    entity.name = name

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return User.toDTO(entity)
  }

  async delete(id: UserDTO['id']): Promise<UserDTO> {
    const entity = await this.repo.findOne({ 
      where: { id },
      relations: [
        'tags', 
        'savings', 
        'years', 'years.months', 
        'months.incomes', 'months.expenses', 'months.categories', 
        'months.categories.expenses'
      ], 
    })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    await this.repo.softRemove(entity)

    return User.toDTO(entity)
  }
  
  async signUp({ name, email, password }: body): Promise<Session> {
    const duplicated = await this.repo.findOneBy({ email })
    if(duplicated) throw DuplicatedException('Este email já existe.')
    
    const hash = await bcrypt.genSalt(+process.env.HASH_SALT_ROUNDS).then(salt => bcrypt.hash(password, salt))
    
    const entity = this.repo.create({ 
      name, 
      email, 
      password: hash,
    })
      
    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)
  
    await this.repo.save(entity)

    return await this.logIn({ email, password })
  }
  
  async logIn({ email, password }: Partial<body>): Promise<Session> {
    const entity = await this.repo.findOneBy({ email })
    if(!entity || !await bcrypt.compare(password, entity.password)) throw ForbiddenException('Email ou senha inválidos.')
    
    const token = await this.authService.generateToken(entity.id)

    return { user: User.toDTO(entity), token }
  }
  
  async resetPassword({ email }: body): Promise<any> {
    return null
  }
}
