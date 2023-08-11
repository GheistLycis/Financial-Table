import { Injectable } from '@nestjs/common';
import UserDTO from '../User.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository as Repo } from '@nestjs/typeorm';
import { User } from '../User';
import { DuplicatedException, ForbiddenException, NotFoundException, ServerException, classValidatorError } from 'src/filters/globalExceptions';
import { validate } from 'class-validator';
import { AuthService } from 'src/app/auth/service/auth.service';
import Session from '@interfaces/Session';
import * as bcrypt from 'bcrypt';
import { Saving } from 'src/app/saving/Saving';
import { Year } from 'src/app/year/Year';
import { Month } from 'src/app/month/Month';
import { MonthlyIncome } from 'src/app/monthly-income/MonthlyIncome';
import { MonthlyExpense } from 'src/app/monthly-expense/MonthlyExpense';
import { Category } from 'src/app/category/Category';
import { Expense } from 'src/app/expense/Expense';
import { Tag } from 'src/app/tag/Tag';

type body = { 
  name?: string
  email?: string
  password?: string 
  newPassword?: string 
 }

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(User) private repo: Repository<User>,
    private authService: AuthService,
  ) {}
  
  async list(user: User['id']): Promise<UserDTO[]> {
    return await this.get(user, user).then(user => [user])
  }

  async get(user: User['id'], id: UserDTO['id']): Promise<UserDTO> {
    if(user != id) throw ForbiddenException('Sem permissão.')
    
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Nenhum usuário encontrado.')

    return User.toDTO(entity)
  }

  async put(user: User['id'], id: UserDTO['id'], { name }: body): Promise<UserDTO> {
    if(user != id) throw ForbiddenException('Sem permissão.')
    
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    entity.name = name

    const errors = await validate(entity)
    if(errors.length) throw classValidatorError(errors)

    await this.repo.save(entity)

    return User.toDTO(entity)
  }

  async delete(user: User['id'], id: UserDTO['id']): Promise<UserDTO> {
    if(user != id) throw ForbiddenException('Sem permissão.')
    
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')

    await this.repo.remove(entity)

    return User.toDTO(entity)
  }
  
  async signUp({ name, email, password }: body): Promise<Session> {
    const duplicated = await this.repo.findOneBy({ email })
    if(duplicated) throw DuplicatedException('Este email já existe.')
    
    const hash = await bcrypt.genSalt(+process.env.HASH_SALT_ROUNDS).then(salt => bcrypt.hash(password, salt))
    const user = { 
      name, 
      email, 
      password: hash,
    }

    await this.dataSource.manager.transaction(manager => this.generateNewUser(manager, user))
    
    return await this.logIn({ email, password })
  }
  
  async logIn({ email, password }: Partial<body>): Promise<Session> {
    const entity = await this.repo.findOneBy({ email })
    if(!entity || !await bcrypt.compare(password, entity.password)) throw ForbiddenException('Email ou senha inválidos.')
    
    const token = await this.authService.generateToken(entity.id)

    return { user: User.toDTO(entity), token }
  }
  
  async resetPassword(user: User['id'], id: UserDTO['id'], { password, newPassword }: body): Promise<UserDTO> {
    if(user != id) throw ForbiddenException('Sem permissão.')
    
    const entity = await this.repo.findOneBy({ id })
    if(!entity) throw NotFoundException('Usuário não encontrado.')
    
    if(!await bcrypt.compare(password, entity.password)) throw ForbiddenException('Senha incorreta.')
    
    const hash = await bcrypt.genSalt(+process.env.HASH_SALT_ROUNDS).then(salt => bcrypt.hash(newPassword, salt))
    
    entity.password = hash
    
    await this.repo.save(entity)
    
    return User.toDTO(entity)
  }
  
  protected async generateNewUser(manager: EntityManager, userObj: { name: string, email: string, password: string }): Promise<void> {
    const user = manager.create(User, userObj)
      
    const errors = await validate(user)
    if(errors.length) throw classValidatorError(errors)
  
    await manager.save(user)

    const randInt = (min=1, max=1) => Math.ceil(Math.random() * (max - min) + min)
    const now = new Date()
    
    // CREATING 1 YEAR
    let year = manager.create(Year, { 
      year: now.getFullYear(),
      user
    })
    await manager.save(year)
    
    // CREATING 1 SAVING 
    const saving = manager.create(Saving, {
      title: 'Viagem!',
      description: 'Eu sou uma caixinha de economia! Comigo você pode organizar seus projetos e acompanhar em tempo real o seu progresso.',
      amount: 3200,
      dueDate: new Date(now.getFullYear() + 1, now.getMonth()),
      user
    })
    await manager.save(saving)
    
    // CREATING 3 TAGS
    const tagsProps = { 
      names: ['Viagem', 'Curso', 'Alimentação'], 
      colors: ['#00FF50', '#BD4B13', '#284B7A'] 
    }
    const tags: Tag[] = []
    for(let i = 0; i < 3; i++) {
      const tag = manager.create(Tag, { 
        name: tagsProps.names[i],
        color: tagsProps.colors[i],
        user
      })
      
      await manager.save(tag)
      tags.push(tag)
    }
    
    // CREATING 3 MONTHS
    const monthsProps = { availables: [60, 45, 50] }
    for(let i = 0; i < 3; i++) {
      now.setDate(randInt(10, 28))
      
      const month = manager.create(Month, { 
        month: now.getMonth() + 1,
        available: monthsProps.availables[i],
        obs: 'Eu sou um mês. Em mim, você pode cadastrar seus ganhos, mensalidades, categorias e registrar seus gastos!',
        year
      })
      await manager.save(month)
      
      // CREATING 1 MONTHLY INCOME
      const monthlyIncome = manager.create(MonthlyIncome, { 
        value: 1000 * randInt(1, i+1),
        description: 'Eu sou uma entrada mensal. Componho o valor total ganho para ser gasto no mês',
        month
      })
      await manager.save(monthlyIncome)
      
      // CREATING 1 MONTHLY EXPENSE
      const monthlyExpense = manager.create(MonthlyExpense, { 
        value: 100 * randInt(1, i+1),
        description: 'Eu sou uma mensalidade. Sou automaticamente descontada de seus ganhos.',
        month
      })
      await manager.save(monthlyExpense)
      
      // CREATING 3 CATEGORIES
      const categoriesProps = { 
        names: ['Livres', 'Essenciais', 'Educação'], 
        colors: ['#F00', '#0F0', '#00F'],
        percentages: [40, 50, 10]
      }
      for(let j = 0; j < 3; j++) {
        const category = manager.create(Category, { 
          name: categoriesProps.names[j],
          color: categoriesProps.colors[j],
          percentage: categoriesProps.percentages[j],
          month
        })
        await manager.save(category)
        
        // CREATING 0-1 EXPENSE PER CATEGORY
        if(Math.random() >= 0.6) {
          // LINKING TAGS TO EXPENSE RANDOMLY
          const expenseTags = tags.filter(() => Math.random() > 0.5)
          const expense = manager.create(Expense, { 
            value: 22.50 * randInt(1, j+1),
            description: 'Eu sou um registro de gasto!',
            date: now,
            category,
            tags: expenseTags
          })
          await manager.save(expense)
          
          now.setDate(now.getDate() - randInt(1, 2))
        }
      }
      
      now.setMonth(now.getMonth() - 1)
      
      // CHECKING IF CHANGING BETWEEN YEARS
      if(i < 2 && now.getMonth() == 11) {
        year = manager.create(Year, { 
          year: now.getFullYear(),
          user
        })
        await manager.save(year)
      }
    }
    
    return
  }
}
