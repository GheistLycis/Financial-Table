import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Year } from 'src/app/year/Year';
import { NotFoundException, ServerException } from 'src/filters/globalExceptions';
import YearHistory from 'src/shared/interfaces/YearHistory';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';
import CategoryRemaining from 'src/shared/interfaces/CategoryRemaining';
import { Category } from 'src/app/category/Category';
import MonthHistory from 'src/shared/interfaces/MonthHistory';
import { Month } from 'src/app/month/Month';
import MonthDTO from 'src/app/month/Month.dto';
import CategoryDTO from 'src/app/category/Category.dto';
import YearDTO from 'src/app/year/Year.dto';
import { User } from 'src/app/user/User';
import CategoryChartData from 'src/shared/interfaces/CategoryChartData';
import { MonthNames } from 'src/shared/enums/MonthNames';
import TagChartData from 'src/shared/interfaces/TagChartData';
import { Tag } from 'src/app/tag/Tag';
import ExpenseChartData from 'src/shared/interfaces/ExpenseChartData';
import HexToRgba from 'src/shared/classes/HexToRgba';


@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(Category) private categoryRepo: Repository<Category>,
    @Repo(Month) private monthRepo: Repository<Month>,
    @Repo(Year) private yearRepo: Repository<Year>,
    @Repo(Tag) private tagRepo: Repository<Tag>,
  ) {}
  
  async categoryRemaining(user: User['id'], id: CategoryDTO['id']): Promise<CategoryRemaining> {
    const category = await this.categoryRepo.createQueryBuilder('Category')
      .innerJoinAndSelect('Category.month', 'Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Category.id = :id', { id })
      .getOne()
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhuma categoria encontrada.')
        
        return Category.toDTO(entity)
      })
      
    const originalAvailable = await this.dataSource
      .query(`
        SELECT (
          (total_monthly_incomes.sum * (m.available / 100) - total_monthly_expenses.sum) * 
          (c.percentage::DECIMAL / 100)
        ) AS originalavailable
        FROM categories c
        JOIN months m ON c."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        JOIN users u ON y."userId" = u.id,
        (
          SELECT COALESCE(SUM(mi.value), 0) AS sum
          FROM categories c
          JOIN monthly_incomes mi ON mi."monthId" = c."monthId"
          WHERE 
            c.id = ${category.id}
            AND mi."deletedAt" IS NULL
            AND (mi."date" IS NULL OR mi."date" <= CURRENT_DATE)
        ) total_monthly_incomes,
        (
          SELECT COALESCE(SUM(me.value), 0) AS sum
          FROM categories c
          JOIN monthly_expenses me ON me."monthId" = c."monthId"
          WHERE 
            c.id = ${category.id}
            AND me."deletedAt" IS NULL
            AND (me."date" IS NULL OR me."date" <= CURRENT_DATE)
        ) total_monthly_expenses
        WHERE 
          c.id = ${category.id}
          AND u.id = ${user}
      `)
      .then(rows => Number(rows[0].originalavailable), err => { throw ServerException(`${err}`) })
      
    const remaining = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(e.value), 0) AS totalexpenses
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        JOIN users u ON y."userId" = u.id
        WHERE 
          c.id = ${category.id}
          AND u.id = ${user}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => originalAvailable - rows[0].totalexpenses, err => { throw ServerException(`${err}`) })
    
    return {
      category,
      originalAvailable,
      remaining,
    }
  }
  
  async monthBalance(user: User['id'], id: MonthDTO['id']): Promise<{ month: MonthDTO, balance: number }> {
    const actualMonth = await this.monthRepo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum mês encontrado.')
        
        return Month.toDTO(entity)
      })
    
    const previousMonths = await this.monthRepo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.year = :year', { year: actualMonth.year.year })
      .andWhere('Month.month < :month', { month: actualMonth.month })
      .getMany()
      .then(entities => entities.map(row => Month.toDTO(row)))
    
    const months = previousMonths.concat(actualMonth)
    let balance: number = 0
    
    for(let i = 0; i < months.length; i++) {
      const { id } = months[i]
      
      balance += await this.dataSource
        .query(`
          SELECT (
            total_incomes.sum * (m.available::DECIMAL / 100) -
            total_monthly_expenses.sum -
            total_expenses.sum
          ) AS balance
          FROM
            months m,
            (
              SELECT COALESCE(SUM(mi.value), 0) AS sum
              FROM monthly_incomes mi
              JOIN months m ON mi."monthId" = m.id
              WHERE 
                m.id = ${id}
                AND mi."deletedAt" IS NULL
                AND (mi."date" IS NULL OR mi."date" <= CURRENT_DATE)
            ) total_incomes,
            (
              SELECT COALESCE(SUM(me.value), 0) AS sum
              FROM monthly_expenses me
              JOIN months m ON me."monthId" = m.id
              WHERE 
                m.id = ${id}
                AND me."deletedAt" IS NULL
                AND (me."date" IS NULL OR me."date" <= CURRENT_DATE)
            ) total_monthly_expenses,
            (
              SELECT COALESCE(SUM(e.value), 0) AS sum
              FROM expenses e
              JOIN categories c ON e."categoryId" = c.id
              JOIN months m ON c."monthId" = m.id
              WHERE 
                m.id = ${id}
                AND e."deletedAt" IS NULL
            ) total_expenses
          WHERE m.id = ${id}
        `)
        .then(rows => Number(rows[0].balance), err => { throw ServerException(`${err}`) })
    }
      
    return {
      month: actualMonth,
      balance,
    }
  }
  
  async mostExpensiveCategory(user: User['id'], id: MonthDTO['id']): Promise<{ name: string, total: number }> {
    const actualMonth =  await this.monthRepo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.categories', 'Category')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    let max = { name: '--', total: 0 }
    
    if(!actualMonth.categories.length) return max
    
    for(const { name, id } of actualMonth.categories) {
      const total = await this.dataSource
        .query(`
          SELECT COALESCE(SUM(e.value), 0) AS total
          FROM expenses e
          JOIN categories c ON e."categoryId" = c.id
          WHERE 
            c.id = ${id}
            AND e."deletedAt" IS NULL
        `)
        .then(rows => Number(rows[0].total), err => { throw ServerException(`${err}`) })

      if(total > max.total) max = { name, total }
    }

    return max
  }
  
  async mostExpensiveTags(user: User['id'], id: MonthDTO['id']): Promise<{ name: string, total: number }> {
    const actualMonth =  await this.monthRepo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.categories', 'Category')
      .leftJoinAndSelect('Category.expenses', 'Expense')
      .leftJoinAndSelect('Expense.tags', 'Tag')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    const totals: { [tagName: string]: number } = {}
    
    for(const { expenses } of actualMonth.categories) {
      for(const { tags, value } of expenses) {
        for(const { name } of tags) {
          if(totals[name]) {
            totals[name] += value
          }
          else {
            totals[name] = value
          }
        }
      }
    }

    const max: {
      names: string[]
      total: number
    } = { names: ['--'], total: 0 }
    
    for(const tagName in totals) {
      if(totals[tagName] == max.total) {
        max.names.push(tagName)
      }
      else if(totals[tagName] > max.total) {
        max.names = [tagName]
        max.total = totals[tagName]
      } 
    }
    
    return { name: max.names.join('; '), total: max.total }
  }
  
  async monthHistory(user: User['id'], id: MonthDTO['id']): Promise<MonthHistory> {
    const month = await this.monthRepo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoinAndSelect('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum mês encontrado.')
        
        return Month.toDTO(entity)
      })
    
    const { 
      monthlyIncomes, 
      monthlyExpenses,
      available,
      expenses
    } = await this.dataSource
      .query(`
        SELECT 
          total_incomes.sum AS monthlyincomes, 
          total_monthly_expenses.sum AS mothlyexpenses,
          (
            total_incomes.sum * (m.available::DECIMAL / 100) - total_monthly_expenses.sum
          ) AS available,
          total_expenses.sum AS expenses
        FROM
          months m,
          (
            SELECT COALESCE(SUM(mi.value), 0) AS sum
            FROM monthly_incomes mi
            JOIN months m ON mi."monthId" = m.id
            WHERE 
              m.id = ${month.id}
              AND mi."deletedAt" IS NULL
              AND (mi."date" IS NULL OR mi."date" <= CURRENT_DATE)
          ) total_incomes,
          (
            SELECT COALESCE(SUM(me.value), 0) AS sum
            FROM monthly_expenses me
            JOIN months m ON me."monthId" = m.id
            WHERE 
              m.id = ${month.id}
              AND me."deletedAt" IS NULL
              AND (me."date" IS NULL OR me."date" <= CURRENT_DATE)
          ) total_monthly_expenses,
          (
            SELECT COALESCE(SUM(e.value), 0) AS sum
            FROM expenses e
            JOIN categories c ON e."categoryId" = c.id
            JOIN months m ON c."monthId" = m.id
            WHERE 
              m.id = ${month.id}
              AND e."deletedAt" IS NULL
          ) total_expenses
        WHERE m.id = ${month.id}
      `)
      .then(([ row ]) => {
        return { 
          monthlyIncomes: Number(row.monthlyincomes), 
          monthlyExpenses: Number(row.mothlyexpenses),
          available: Number(row.available),
          expenses: Number(row.expenses),
        }
      }, err => { throw ServerException(`${err}`) })

    return {
      month,
      monthlyIncomes,
      monthlyExpenses,
      available,
      expenses
    } 
  }
  
  async recentExpenses(user: User['id'], id: MonthDTO['id']): Promise<number | '--'> {
    const actualMonth = await this.monthRepo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    let previousMonth: Month
    
    if(actualMonth.month > 1) {
      previousMonth = await this.monthRepo.createQueryBuilder('Month')
        .innerJoin('Month.year', 'Year')
        .innerJoin('Year.user', 'User')
        .where('User.id = :user', { user })
        .andWhere('Month.month = :month', { month: actualMonth.month -1 })
        .andWhere('Year.id = :yearId', { yearId: actualMonth.year.id })
        .getOne()
    }
    else {
      previousMonth = await this.monthRepo.createQueryBuilder('Month')
        .innerJoin('Month.year', 'Year')
        .innerJoin('Year.user', 'User')
        .where('User.id = :user', { user })
        .andWhere('Month.month = 12')
        .andWhere('Year.year = :year', { year: actualMonth.year.year -1 })
        .getOne()
    }
    
    if(!previousMonth) return '--'
    
    const actualMonthExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        WHERE 
          m.id = ${actualMonth.id}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    const previousMonthExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        WHERE 
          m.id = ${previousMonth.id}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    return actualMonthExpenses && previousMonthExpenses 
      ? ((100 * actualMonthExpenses / previousMonthExpenses) -100)
      : '--'
  }
  
  async yearExpenses(user: User['id'], id: MonthDTO['id']): Promise<number | '--'> {
    const actualMonth = await this.monthRepo.createQueryBuilder('Month')
      .innerJoinAndSelect('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id = :id', { id })
      .getOne()
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    const actualMonthExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        WHERE 
          m.id = ${actualMonth.id}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    const yearAverageExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        WHERE
          m.month < ${actualMonth.month}
          AND y.id = ${actualMonth.year.id}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    return actualMonthExpenses && yearAverageExpenses 
      ? ((100 * actualMonthExpenses / yearAverageExpenses) -100)
      : '--'
  }

  async yearHistory(user: User['id'], id: YearDTO['id']): Promise<YearHistory> {
    const year = await this.yearRepo.createQueryBuilder('Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Year.id = :id', { id })
      .getOne()
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum ano encontrado.')
        
        return Year.toDTO(entity)
      })
    
    const available = await this.dataSource
      .query(`
        SELECT total_incomes.sum - total_monthly_expenses.sum AS available
        FROM
          years y,
          (
            SELECT COALESCE(SUM(mi.value * (m.available:: DECIMAL / 100)), 0) AS sum
            FROM monthly_incomes mi
            JOIN months m ON mi."monthId" = m.id
            JOIN years y ON m."yearId" = y.id
            WHERE 
              y.id = ${year.id}
              AND mi."deletedAt" IS NULL
              AND (mi."date" IS NULL OR mi."date" <= CURRENT_DATE)
          ) total_incomes,
          (
            SELECT COALESCE(SUM(me.value), 0) AS sum
            FROM monthly_expenses me
            JOIN months m ON me."monthId" = m.id
            JOIN years y ON m."yearId" = y.id
            WHERE 
              y.id = ${year.id}
              AND me."deletedAt" IS NULL
              AND (me."date" IS NULL OR me."date" <= CURRENT_DATE)
          ) total_monthly_expenses
        WHERE y.id = ${year.id}
      `)
      .then(rows => Number(rows[0].available), err => { throw ServerException(`${err}`) })
      
    const monthlyIncomes = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(mi.value), 0) AS monthlyincomes
        FROM monthly_incomes mi
        JOIN months m ON mi."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        WHERE 
          y.id = ${year.id}
          AND mi."deletedAt" IS NULL
          AND (mi."date" IS NULL OR mi."date" <= CURRENT_DATE)
      `)
      .then(rows => Number(rows[0].monthlyincomes), err => { throw ServerException(`${err}`) })
      
    const monthlyExpenses = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(me.value), 0) AS monthlyexpenses
        FROM monthly_expenses me
        JOIN months m ON me."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        WHERE 
          y.id = ${year.id}
          AND me."deletedAt" IS NULL
          AND (me."date" IS NULL OR me."date" <= CURRENT_DATE)
      `)
      .then(rows => Number(rows[0].monthlyexpenses), err => { throw ServerException(`${err}`) })
      
    const expenses = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(e.value), 0) AS expenses
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        JOIN years y ON m."yearId" = y.id
        WHERE 
          y.id = ${year.id}
          AND e."deletedAt" IS NULL
      `)
      .then(rows => Number(rows[0].expenses), err => { throw ServerException(`${err}`) })

    return {
      year,
      available,
      monthlyIncomes,
      monthlyExpenses,
      expenses,
    } 
  }

  async categoryChart(user: User['id'], monthIds: MonthDTO['id'][]): Promise<CategoryChartData> {
    const result: CategoryChartData = {
      labels: [],
      datasets: []
    }
    const months = await this.monthRepo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id IN (:...monthIds)', { monthIds })
      .getMany()
    const categories = await this.dataSource
      .query(`
        SELECT 
          c.name, 
          c.color
        FROM categories c
        JOIN months m ON m.id = c."monthId"
        WHERE 
          m.id IN (${months.map(({ id }) => id)})
          AND c."deletedAt" IS NULL
        GROUP BY c.name, c.color
      `)
      .then((categories: { name: string, color: string }[]) => {
        return categories.filter((val, i, arr) => {
          const category = arr.find(el => el.name == val.name)

          return category.color == val.color
        })
      })
    const colors = categories.map(({ color }) => color)

    result.labels = categories.map(({ name }) => name)

    for(const { id, month } of months) {
      const dataset = {
        data: [],
        label: MonthNames[month],
        backgroundColor: colors.map(color => HexToRgba.convert(color, 0.5)),
        borderColor: colors
      }

      for(const { name } of categories) {
        const data = await this.dataSource
          .query(`
            SELECT COALESCE(SUM(e."value"), 0) AS sum
            FROM expenses e
            JOIN categories c ON c.id = e."categoryId"
            JOIN months m ON m.id = c."monthId"
            WHERE 
              c.name = '${name}'
              AND m.id = ${id}
              AND e."deletedAt" IS NULL
          `)
          .then(rows => +rows[0].sum, err => { throw ServerException(`${err}`) })

        dataset.data.push(data)
      }

      result.datasets.push(dataset)
    }

    return result
  } 

  async tagChart(user: User['id'], monthIds: MonthDTO['id'][]): Promise<TagChartData> {
    const result: TagChartData = {
      labels: [],
      datasets: []
    }
    const months = await this.monthRepo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id IN (:...monthIds)', { monthIds })
      .getMany()
    const tags = await this.tagRepo.createQueryBuilder('Tag')
      .innerJoin('Tag.user', 'User')
      .where('User.id = :user', { user })
      .getMany()
    const data = []

    for(const month of months) {
      const monthData = {
        tagsData: [],
        month: month.month,
      }

      for(const { id, name, color } of tags) {
        const tagData = await this.dataSource
          .query(`
            SELECT COALESCE(SUM(e."value"), 0) AS sum
            FROM expenses e
            JOIN expenses_tags_tags ett ON ett."expensesId" = e.id
            JOIN tags t ON t.id = ett."tagsId"
            JOIN categories c ON c.id = e."categoryId"
            JOIN months m ON m.id = c."monthId"
            WHERE 
              m.id = ${month.id}
              AND t.id = ${id}
              AND e."deletedAt" IS NULL
          `)
          .then(row => {
            return {
              tag: name,
              color: color,
              sum: +row[0].sum
            }
          },
          err => { 
            throw ServerException(`${err}`) 
          })

        monthData.tagsData.push(tagData)
      }

      data.push(monthData)
    }

    data.forEach(({ tagsData, month }) => {
      result.datasets.push({
        data: tagsData.map(({ sum }) => sum),
        label: MonthNames[month],
        backgroundColor: tagsData.map(({ color }) => HexToRgba.convert(color, 0.5)),
        borderColor: tagsData.map(({ color }) => color),
      })
    })

    result.labels = tags.map(({ name }) => name)

    return result
  } 

  async expenseChart(user: User['id'], monthIds: MonthDTO['id'][]): Promise<ExpenseChartData> {
    const result: ExpenseChartData = {
      labels: [...Array(31).keys()].map(n => (n+1).toString()),
      datasets: []
    }
    const months = await this.monthRepo.createQueryBuilder('Month')
      .innerJoin('Month.year', 'Year')
      .innerJoin('Year.user', 'User')
      .where('User.id = :user', { user })
      .andWhere('Month.id IN (:...monthIds)', { monthIds })
      .getMany()

    for(const { id, month } of months) {
      const monthData: number[] = []

      for(const date of result.labels) {
        const dateData = await this.dataSource
          .query(`
            SELECT COUNT(*) AS count
            FROM expenses e
            JOIN categories c ON c.id = e."categoryId"
            JOIN months m ON m.id = c."monthId"
            WHERE 
              m.id = ${id}
              AND e.date IS NOT NULL
              AND EXTRACT(DAY FROM e.date) = ${date}::INTEGER
              AND e."deletedAt" IS NULL
          `)
          .then(rows => +rows[0].count, err => { throw ServerException(`${err}`) })
        
        monthData.push(dateData)
      }

      result.datasets.push({
        label: MonthNames[month],
        data: monthData,
      })
    }

    return result
  } 
}