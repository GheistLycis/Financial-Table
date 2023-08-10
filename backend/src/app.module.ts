import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import { RequestLoggerMiddleware } from './middlewares/request-logger/request-logger.middleware';
import { YearModule } from './app/year/year.module';
import { MonthModule } from './app/month/month.module';
import { MonthlyIncomeModule } from './app/monthly-income/monthly-income.module';
import { TagModule } from './app/tag/tag.module';
import { CategoryModule } from './app/category/category.module';
import { ExpenseModule } from './app/expense/expense.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from './app/analytics/analytics.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './guards/token/token.guard';
import { UserModule } from './app/user/user.module';
// import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './app/auth/auth.module';
import { MonthlyExpenseModule } from './app/monthly-expense/monthly-expense.module';
import { SavingModule } from './app/saving/saving.module';
import { AppController } from './app.controller';


const CACHE_LIFE_MINUTES = 60 // same as token expiration

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().default('postgres'),
        DB_PASS: Joi.string().default('postgres'),
        DB_NAME: Joi.string().default('financial_table'),
        PORT: Joi.number().default(8000),
        JWT: Joi.string().required(),
        HASH_SALT_ROUNDS: Joi.number().required(),
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
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: CACHE_LIFE_MINUTES * 60 * 1000,
    //   max: 20,
    // }),
    AuthModule,
    YearModule, 
    MonthModule, 
    MonthlyIncomeModule, 
    MonthlyExpenseModule, 
    TagModule, 
    CategoryModule, 
    ExpenseModule, 
    AnalyticsModule,
    UserModule,
    SavingModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*')
  }
}
