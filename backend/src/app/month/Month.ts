import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsInt, Max, Min } from 'class-validator';
import BaseEntity, { manyToOneOptions, oneToManyOptions } from "src/shared/classes/BaseEntity";
import { Category } from "../category/Category";
import MonthDTO from "./Month.dto";
import { Year } from "../year/Year";
import { MonthlyIncome } from "../monthly-income/MonthlyIncome";
import { MonthlyExpense } from "../monthly-expense/MonthlyExpense";
import DecimalTransformer from "src/shared/classes/DecimalTransformer";

@Service()
@Entity("months")
export class Month extends BaseEntity {
  // COLUMNS
  @Column()
  @IsInt() @Min(1) @Max(12)
  month: number
  
  @Column({ type: 'decimal', scale: 1, transformer: new DecimalTransformer() })
  @Min(1) @Max(100)
  available: number

  @Column({ nullable: true, default: '' })
  obs: string

  // RELATIONS
  @ManyToOne(() => Year, year => year.months, manyToOneOptions)
  year: Year

  @OneToMany(() => Category, category => category.month, oneToManyOptions)
  categories: Category[]

  @OneToMany(() => MonthlyIncome, income => income.month, oneToManyOptions)
  incomes: MonthlyIncome[]
  
  @OneToMany(() => MonthlyExpense, expense => expense.month, oneToManyOptions)
  expenses: MonthlyExpense[]

  static toDTO(row: Month): MonthDTO {
    return {
      month: row.month,
      available: row.available,
      obs: row.obs,
      year: row.year ? Year.toDTO(row.year) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}