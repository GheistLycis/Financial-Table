import { MiddlewareConsumer, Module } from '@nestjs/common';
import { loggerMiddleware } from './middlewares/logger';
import { YearModule } from './content/year/year.module';
import { MonthModule } from './content/month/month.module';
import { MonthlyEntryModule } from './content/monthly-entry/monthly-entry.module';
import { GroupModule } from './content/group/group.module';
import { CategoryModule } from './content/category/category.module';
import { ExpenseModule } from './content/expense/expense.module';

@Module({
  imports: [
    YearModule, 
    MonthModule, 
    MonthlyEntryModule, 
    GroupModule, 
    CategoryModule, 
    ExpenseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      .forRoutes('*')
  }
}
