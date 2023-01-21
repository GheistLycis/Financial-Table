import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository as Repo } from '@nestjs/typeorm';
import { Expense } from 'src/content/expense/Expense';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Repo(Expense) private readonly expensesRepo: Repository<Expense>,
  ) {}

  async recentExpenses(): Promise<number> {
    let result: number = 0

    result = await this.dataSource.query(``)

    return result
  }
}