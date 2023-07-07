import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Year } from 'src/app/year/Year';
import { NotFoundException, ServerException } from 'src/shared/functions/globalExceptions';
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


@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(Category) private categoryRepo: Repository<Category>,
    @Repo(Month) private monthRepo: Repository<Month>,
    @Repo(Year) private yearRepo: Repository<Year>,
  ) {}
  
  async categoryRemaining(id: CategoryDTO['id']): Promise<CategoryRemaining> {
    const category = await this.categoryRepo.findOneBy({ id })
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
        JOIN months m ON c."monthId" = m.id,
        (
          SELECT COALESCE(SUM(mi.value), 0) AS sum
          FROM categories c
          JOIN monthly_incomes mi ON mi."monthId" = c."monthId"
          WHERE c.id = ${id}
        ) total_monthly_incomes,
        (
          SELECT COALESCE(SUM(me.value), 0) AS sum
          FROM categories c
          JOIN monthly_expenses me ON me."monthId" = c."monthId"
          WHERE c.id = ${id}
        ) total_monthly_expenses
        WHERE c.id = ${id}
      `)
      .then(rows => Number(rows[0].originalavailable), err => { throw ServerException(`${err}`) })
      
    const remaining = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(e.value), 0) AS totalexpenses
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        WHERE c.id = ${id}
      `)
      .then(rows => originalAvailable - rows[0].totalexpenses, err => { throw ServerException(`${err}`) })
    
    return {
      category,
      originalAvailable,
      remaining,
    }
  }
  
  async monthBalance(id: MonthDTO['id']): Promise<{ month: MonthDTO, balance: number } | any> {
    const actualMonth = await this.monthRepo.createQueryBuilder('Month')
      .leftJoinAndSelect('Month.year', 'Year')
      .where('Month.id = :id', { id })
      .getOne()
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum mês encontrado.')
        
        return Month.toDTO(entity)
      })
    
    const previousMonths = await this.monthRepo.createQueryBuilder('Month')
      .leftJoin('Month.year', 'Year')
      .where('Year.year = :year', { year: actualMonth.year.year })
      .andWhere('Month.month < :month', { month: actualMonth.month })
      .orderBy('Month.month')
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
              WHERE m.id = ${id}
            ) total_incomes,
            (
              SELECT COALESCE(SUM(me.value), 0) AS sum
              FROM monthly_expenses me
              JOIN months m ON me."monthId" = m.id
              WHERE m.id = ${id}
            ) total_monthly_expenses,
            (
              SELECT COALESCE(SUM(e.value), 0) AS sum
              FROM expenses e
              JOIN categories c ON e."categoryId" = c.id
              JOIN months m ON c."monthId" = m.id
              WHERE m.id = ${id}
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
  
  async monthHistory(id: MonthDTO['id']): Promise<MonthHistory> {
    const month = await this.monthRepo
      .findOne({ 
        where: { id }, 
        relations: { year: true } 
      })
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
            WHERE m.id = ${id}
          ) total_incomes,
          (
            SELECT COALESCE(SUM(me.value), 0) AS sum
            FROM monthly_expenses me
            JOIN months m ON me."monthId" = m.id
            WHERE m.id = ${id}
          ) total_monthly_expenses,
          (
            SELECT COALESCE(SUM(e.value), 0) AS sum
            FROM expenses e
            JOIN categories c ON e."categoryId" = c.id
            JOIN months m ON c."monthId" = m.id
            WHERE m.id = ${id}
          ) total_expenses
        WHERE m.id = ${id}
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
  
  async recentExpenses(id: MonthDTO['id']): Promise<number | '--'> {
    const actualMonth = await this.monthRepo.findOne({
      where: { id },
      relations: { year: true }
    })
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    let previousMonth: Month
    
    if(actualMonth.month > 1) {
      previousMonth = await this.monthRepo.createQueryBuilder('Month')
        .innerJoin('Month.year', 'Year')
        .where('Month.month = :month', { month: actualMonth.month -1 })
        .andWhere('Year.id = :yearId', { yearId: actualMonth.year.id })
        .getOne()
    }
    else {
      previousMonth = await this.monthRepo.createQueryBuilder('Month')
        .innerJoin('Month.year', 'Year')
        .where('Month.month = 12')
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
        WHERE m.id = ${actualMonth.id}
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    const previousMonthExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        WHERE m.id = ${previousMonth.id}
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    return actualMonthExpenses && previousMonthExpenses 
      ? ((100 * actualMonthExpenses / previousMonthExpenses) -100)
      : '--'
  }
  
  async yearExpenses(id: MonthDTO['id']): Promise<number | '--'> {
    const actualMonth = await this.monthRepo.findOne({
      where: { id },
      relations: { year: true }
    })
    if(!actualMonth) throw NotFoundException('Nenhum mês encontrado.')
    
    const actualMonthExpenses = await this.dataSource
      .query(`
        SELECT AVG(e.value) AS average
        FROM expenses e
        JOIN categories c ON e."categoryId" = c.id
        JOIN months m ON c."monthId" = m.id
        WHERE m.id = ${actualMonth.id}
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
      `)
      .then(rows => Number(rows[0].average), err => { throw ServerException(`${err}`) })
      
    return actualMonthExpenses && yearAverageExpenses 
      ? ((100 * actualMonthExpenses / yearAverageExpenses) -100)
      : '--'
  }

  async yearHistory(id: YearDTO['id']): Promise<YearHistory> {
    const year = await this.yearRepo.findOneBy({ id })
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
            WHERE y.id = ${id}
          ) total_incomes,
          (
            SELECT COALESCE(SUM(me.value), 0) AS sum
            FROM monthly_expenses me
            JOIN months m ON me."monthId" = m.id
            JOIN years y ON m."yearId" = y.id
            WHERE y.id = ${id}
          ) total_monthly_expenses
        WHERE y.id = ${id}
      `)
      .then(rows => Number(rows[0].available), err => { throw ServerException(`${err}`) })
      
    const monthlyIncomes = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(mi.value), 0) AS monthlyincomes
        FROM
          monthly_incomes mi
          JOIN months m ON mi."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE y.id = ${id}
      `)
      .then(rows => Number(rows[0].monthlyincomes), err => { throw ServerException(`${err}`) })
      
    const monthlyExpenses = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(me.value), 0) AS monthlyexpenses
        FROM
          monthly_expenses me
          JOIN months m ON me."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE y.id = ${id}
      `)
      .then(rows => Number(rows[0].monthlyexpenses), err => { throw ServerException(`${err}`) })
      
    const expenses = await this.dataSource
      .query(`
        SELECT COALESCE(SUM(e.value), 0) AS expenses
        FROM
          expenses e
          JOIN categories c ON e."categoryId" = c.id
          JOIN months m ON c."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE y.id = ${id}
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
}