import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import ExpenseDTO from "src/DTOs/expense";
import { Group } from "./Group";
import { BaseEntity, manyToOneOptions } from "../database/BaseEntity";

@Service()
@Entity("expenses")
export class Expense extends BaseEntity  {
  // COLUMNS
  @Column()
  value: number

  @Column()
  description: string

  @Column({ type: 'date' })
  date: Date

  // RELATIONS
  @ManyToOne(() => Group, group => group.expenses, manyToOneOptions)
  group: Group

  static toDTO(row: Expense): ExpenseDTO {
    return {
      value: row.value,
      description: row.description,
      date: row.date,
      group: Group.toDTO(row.group),
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}