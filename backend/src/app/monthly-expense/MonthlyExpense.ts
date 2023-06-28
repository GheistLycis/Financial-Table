import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import BaseEntity, { manyToOneOptions } from "src/shared/classes/BaseEntity";
import { Month } from "../month/Month";
import MonthlyExpenseDTO from "./MonthlyExpense.dto";
import { Min } from "class-validator";

@Service()
@Entity("monthly_expenses")
export class MonthlyExpense extends BaseEntity {
  // COLUMNS
  @Column()
  @Min(1)
  value: number

  @Column({ nullable: true, default: '' })
  description: string

  // RELATIONS
  @ManyToOne(() => Month, month => month.expenses, manyToOneOptions)
  month: Month

  static toDTO(row: MonthlyExpense): MonthlyExpenseDTO {
    return {
      value: row.value,
      description: row.description,
      month: row.month ? Month.toDTO(row.month) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}