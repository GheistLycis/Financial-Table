import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import ExpenseDTO from "./Expense.dto";
import { Group } from "../group/Group";
import { BaseEntity, manyToOneOptions } from "../../common/BaseEntity";

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
      group: row.group ? Group.toDTO(row.group) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}