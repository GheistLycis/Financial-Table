import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository as Repo } from '@nestjs/typeorm';
import { Expense } from 'src/app/expense/Expense';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Repo(Expense) private expensesRepo: Repository<Expense>,
  ) {}

  async recentExpenses(): Promise<number> {
    let result: number = 0

    result = await this.dataSource.query(``)

    return result
  }
}