import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsInt, Max, Min } from 'class-validator';
import BaseEntity, { manyToOneOptions, OneToManyOptions } from "src/shared/classes/BaseEntity";
import { Category } from "../category/Category";
import MonthDTO from "./Month.dto";
import { Year } from "../year/Year";
import { MonthlyIncome } from "../monthly-entry/MonthlyIncome";

@Service()
@Entity("months")
export class Month extends BaseEntity {
  // COLUMNS
  @Column()
  @IsInt() @Min(1) @Max(12)
  month: number

  @Column({ nullable: true, default: '' })
  obs: string

  // RELATIONS
  @ManyToOne(() => Year, year => year.months, manyToOneOptions)
  year: Year

  @OneToMany(() => Category, category => category.month, OneToManyOptions)
  categories: Category[]

  @OneToMany(() => MonthlyIncome, income => income.month, OneToManyOptions)
  incomes: MonthlyIncome[]
  
  @OneToMany(() => MonthlyExpense, expense => expense.month, OneToManyOptions)
  expenses: MonthlyExpense[]

  static toDTO(row: Month): MonthDTO {
    return {
      month: row.month,
      obs: row.obs,
      year: row.year ? Year.toDTO(row.year) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}