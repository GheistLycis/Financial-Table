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
    let result: YearHistory
    
    const year = await this.yearRepo.findOneBy({ id })
      .then(entity => {
        if(!entity) throw NotFoundException('Nenhum ano encontrado.')
        
        return Year.toDTO(entity)
      })
    
    const { available } = await this.dataSource
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
      .then(rows => rows[0], err => { throw ServerException(`${err}`) })
    
    result = {
      year,
      available: +available,
      monthlyIncomes: undefined,
      monthlyExpenses: undefined,
      expenses: undefined
    } 

    return result
  }
}