import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Year } from 'src/app/year/Year';
import { NotFoundException, ServerException } from 'src/shared/functions/globalExceptions';
import YearHistory from 'src/shared/interfaces/YearHistory';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository as Repo } from '@nestjs/typeorm';


@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(Year) private yearRepo: Repository<Year>,
  ) {}

  async yearHistory(id: string): Promise<YearHistory> {
    const year = await this.yearRepo.findOneBy({ id })
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum ano encontrado.')
        
        return Year.toDTO(entity)
      })
    
    const available = await this.dataSource
      .query(`
        SELECT 
          SUM(month_available) AS available
        FROM (
          SELECT 
            (mi.value * (m.available::DECIMAL / 100)) AS month_available
          FROM
            monthly_incomes mi
            JOIN months m ON mi."monthId" = m.id
            JOIN years y ON m."yearId" = y.id
          WHERE
            y.id = '${id}'
        ) sub;
      `)
      .then(rows => +rows[0].available, err => { throw ServerException(`${err}`) })
      
    const monthlyIncomes = await this.dataSource
      .query(`
        SELECT 
          SUM(mi.value) AS monthlyincomes
        FROM
          monthly_incomes mi
          JOIN months m ON mi."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE
          y.id = '${id}'
      `)
      .then(rows => +rows[0].monthlyincomes, err => { throw ServerException(`${err}`) })
      
    const monthlyExpenses = await this.dataSource
      .query(`
        SELECT 
          SUM(me.value) AS monthlyexpenses
        FROM
          monthly_expenses me
          JOIN months m ON me."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE
          y.id = '${id}'
      `)
      .then(rows => +rows[0].monthlyexpenses, err => { throw ServerException(`${err}`) })
      
    const expenses = await this.dataSource
      .query(`
        SELECT 
          SUM(e.value) AS expenses
        FROM
          expenses e
          JOIN groups g ON e."groupId" = g.id
          JOIN categories c ON g."categoryId" = c.id
          JOIN months m ON c."monthId" = m.id
          JOIN years y ON m."yearId" = y.id
        WHERE
          y.id = '${id}'
      `)
      .then(rows => +rows[0].expenses, err => { throw ServerException(`${err}`) })

    return {
      year,
      available,
      monthlyIncomes,
      monthlyExpenses,
      expenses,
    } 
  }
}