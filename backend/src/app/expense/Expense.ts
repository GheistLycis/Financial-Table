import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import ExpenseDTO from "./Expense.dto";
import { Group } from "../group/Group";
import BaseEntity, { manyToOneOptions } from "../../shared/classes/BaseEntity";
import DecimalTransformer from "src/shared/classes/DecimalTransformer";
import { Min } from "class-validator";

@Service()
@Entity("expenses")
export class Expense extends BaseEntity  {
  // COLUMNS
  @Column({ type: 'decimal', scale: 2, transformer: new DecimalTransformer() })
  @Min(1)
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