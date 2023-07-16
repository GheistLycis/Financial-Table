import { Injectable } from '@nestjs/common';
import UserDTO from '../User.dto';
import { Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import { User } from '../User';
import { DuplicatedException, ForbiddenException, NotFoundException, classValidatorError } from 'src/filters/globalExceptions';
import { validate } from 'class-validator';
import { AuthService } from 'src/app/auth/service/auth.service';
import Session from 'src/shared/interfaces/Session';
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
    @Repo(User) private repo: Repository<User>,
    @Repo(Saving) private savingRepo: Repository<Saving>,
    @Repo(Year) private yearRepo: Repository<Year>,
    @Repo(Month) private monthRepo: Repository<Month>,
    @Repo(MonthlyIncome) private monthlyIncomeRepo: Repository<MonthlyIncome>,
    @Repo(MonthlyExpense) private monthlyExpenseRepo: Repository<MonthlyExpense>,
    @Repo(Category) private categoryRepo: Repository<Category>,
    @Repo(Expense) private expenseRepo: Repository<Expense>,
    @Repo(Tag) private tagRepo: Repository<Tag>,
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
  
    await this.repo.save(entity).then(user => this.populateNewUser(user))
    
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
  
  protected async populateNewUser(user: User): Promise<void> {
    const now = new Date()
    
    // CREATING 1 YEAR
    const year = this.yearRepo.create({ 
      year: now.getFullYear(),
      user
    })
    await this.yearRepo.save(year)
    
    // CREATING 1 SAVING 
    const saving = this.savingRepo.create({
      title: 'Viagem!',
      description: 'Eu sou uma caixinha de economia! Comigo você pode organizar seus projetos e acompanhar em tempo real o seu progresso.',
      amount: 2500,
      dueDate: new Date(`${now.getFullYear() + 1}-01-01`),
      user
    })
    this.savingRepo.save(saving)
    
    // CREATING 3 TAGS
    const tagsProps = { 
      names: ['Educação', 'Livros', 'Alimentação'], 
      colors: ['#00FF50', '#BD4B13', '#284B7A'] 
    }
    const tags: Tag[] = []
    for(let i = 0; i < 3; i++) {
      const tag = this.tagRepo.create({ 
        name: tagsProps.names[i],
        color: tagsProps.colors[i],
        user
      })
      
      await this.tagRepo.save(tag)
      tags.push(tag)
    }
    
    // CREATING 2 MONTHS
    const monthsProps = { availables: [60, 45] }
    for(let i = 1; i < 3; i++) {
      const month = this.monthRepo.create({ 
        month: now.getMonth() + 1 - i,
        available: monthsProps.availables[i-1],
        obs: 'Eu sou um mês. Em mim, você pode cadastrar seus ganhos, mensalidades, categorias e registrar seus gastos!',
        year
      })
      await this.monthRepo.save(month)
      
      // CREATING 1 MONTHLY INCOME
      const monthlyIncome = this.monthlyIncomeRepo.create({ 
        value: 2000 * 0.5 * i,
        description: 'Eu sou uma entrada mensal. Componho o valor total ganho para ser gasto no mês',
        month
      })
      this.monthlyIncomeRepo.save(monthlyIncome)
      
      // CREATING 1 MONTHLY EXPENSE
      const monthlyExpense = this.monthlyExpenseRepo.create({ 
        value: 100 * 0.75 * i,
        description: 'Eu sou uma mensalidade. Sou automaticamente descontada de seus ganhos.',
        month
      })
      this.monthlyExpenseRepo.save(monthlyExpense)
      
      // CREATING 2 CATEGORIES
      const categoriesProps = { 
        names: ['Livres', 'Essenciais'], 
        colors: ['#FF0000', '#00FF00'],
        percentages: [40, 60]
      }
      for(let j = 1; j < 3; j++) {
        const category = this.categoryRepo.create({ 
          name: categoriesProps.names[j-1],
          color: categoriesProps.colors[j-1],
          percentage: categoriesProps.percentages[j-1],
          month
        })
        await this.categoryRepo.save(category)
        
        // CREATING 2 EXPENSES
        let expense = this.expenseRepo.create({ 
          value: 25 * j,
          description: 'Eu sou um registro de gasto!',
          date: now,
          category,
          tags: [tags[0]]
        })
        this.expenseRepo.save(expense)
        now.setDate(now.getDate() - 1)
        
        expense = this.expenseRepo.create({ 
          value: 99 * 0.5 * j,
          description: 'Eu sou um registro de gasto!',
          date: now,
          category,
          tags: [tags[1], tags[2]]
        })
        this.expenseRepo.save(expense)
        now.setDate(now.getDate() - 1)
      }
    }
    
    return
  }
}
