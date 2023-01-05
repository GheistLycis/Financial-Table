import { DataSource } from "typeorm";
import { MonthlyEntry } from "../content/monthly-entry/MonthlyEntry";
import { Category } from "../content/category/Category";
import { Expense } from "../content/expense/Expense";
import { Group } from "../content/group/Group";
import { Month } from "../content/month/Month";
import { Year } from "../content/year/Year";


export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
      Category,
      Expense,
      Group,
      Month,
      MonthlyEntry,
      Year,
  ],
  migrations: [],
  subscribers: [],
})