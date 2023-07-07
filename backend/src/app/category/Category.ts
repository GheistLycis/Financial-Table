import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import CategoryDTO from "./Category.dto";
import BaseEntity, { manyToOneOptions, oneToManyOptions } from "src/shared/classes/BaseEntity";
import { Month } from "../month/Month";
import { Max, Min, Validate } from "class-validator";
import IsColor from "src/shared/decorators/class-validator/IsColor";
import { Expense } from "../expense/Expense";

@Service()
@Entity({ name: 'categories', orderBy: { createdAt: 'DESC' }})
export class Category extends BaseEntity  {
  // COLUMNS
  @Column()
  name: string

  @Column()
  @Validate(IsColor)
  color: string

  @Column()
  @Min(0) @Max(100)
  percentage: number

  // RELATIONS
  @ManyToOne(() => Month, month => month.categories, manyToOneOptions)
  month: Month

  @OneToMany(() => Expense, expense => expense.category, oneToManyOptions)
  expenses: Expense[]

  static toDTO(row: Category): CategoryDTO {
    return {
      name: row.name,
      color: row.color,
      percentage: row.percentage,
      month: row.month ? Month.toDTO(row.month) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}