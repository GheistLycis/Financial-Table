import { DataSource } from "typeorm";
import { Category } from "../entities/Category";
import { Expense } from "../entities/Expense";
import { Group } from "../entities/Group";
import { Month } from "../entities/Month";
import { Year } from "../entities/Year";


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
      Year,
  ],
  migrations: [],
  subscribers: [],
})