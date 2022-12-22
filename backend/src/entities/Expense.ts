import { Service } from "typedi";
import { v4 as uuid } from "uuid";
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from "typeorm";
import ExpenseDTO from "src/DTOs/expense";
import { Group } from "./Group";
import { manyToOneOptions } from "src/DTOs/baseDTO";

@Service()
@Entity("expenses")
export class Expense  {
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

  // BASE
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor() {
    if(!this.id) this.id = uuid()
  }

  public static toDTO(row: Expense): ExpenseDTO {
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