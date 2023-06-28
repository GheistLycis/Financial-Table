import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import YearHistory from 'src/shared/interfaces/YearHistory';
import { DataSource } from 'typeorm';


@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource
  ) {}

  async yearHistory(id: string): Promise<YearHistory> {
    const result: YearHistory = {
      year: undefined,
      available: undefined,
      monthlyIncomes: undefined,
      monthlyExpenses: undefined,
      expenses: undefined,
    }

    const rawResult = await this.dataSource.query(``)

    return result
  }
}