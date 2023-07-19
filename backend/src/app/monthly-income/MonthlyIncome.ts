import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import BaseEntity, { manyToOneOptions } from "src/shared/classes/BaseEntity";
import { Month } from "../month/Month";
import MonthlyIncomeDTO from "./MonthlyIncome.dto";
import { Min } from "class-validator";
import DecimalTransformer from "src/shared/classes/DecimalTransformer";

@Service()
@Entity({ name: 'monthly_incomes', orderBy: { createdAt: 'DESC' }})
export class MonthlyIncome extends BaseEntity {
  // COLUMNS
  @Column({ type: 'decimal', scale: 2, transformer: new DecimalTransformer() })
  @Min(1)
  value: number
  
  @Column({ type: 'date', nullable: true })
  date: Date

  @Column({ nullable: true, default: '' })
  description: string

  // RELATIONS
  @ManyToOne(() => Month, month => month.incomes, manyToOneOptions)
  month: Month

  static toDTO(row: MonthlyIncome): MonthlyIncomeDTO {
    return {
      value: row.value,
      date: row.date,
      description: row.description,
      month: row.month ? Month.toDTO(row.month) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}