import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { loggerMiddleware } from './middlewares/logger';
import { YearModule } from './app/year/year.module';
import { MonthModule } from './app/month/month.module';
import { MonthlyEntryModule } from './app/monthly-entry/monthly-entry.module';
import { GroupModule } from './app/group/group.module';
import { CategoryModule } from './app/category/category.module';
import { ExpenseModule } from './app/expense/expense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from './app/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),
    YearModule, 
    MonthModule, 
    MonthlyEntryModule, 
    GroupModule, 
    CategoryModule, 
    ExpenseModule, 
    AnalyticsModule,
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
