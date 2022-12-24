import { Service } from "typedi";
import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import { BaseEntity, manyToOneOptions } from "src/configs/BaseEntity";
import { Month } from "./Month";
import MonthlyEntryDTO from "src/DTOs/monthlyEntry";

@Service()
@Entity("monthly_entries")
export class MonthlyEntry extends BaseEntity {
  // COLUMNS
  @Column()
  value: number

  @Column({ nullable: true, default: '' })
  description: string

  // RELATIONS
  @ManyToOne(() => Month, month => month.entries, manyToOneOptions)
  month: Month

  static toDTO(row: MonthlyEntry): MonthlyEntryDTO {
    return {
      value: row.value,
      description: row.description,
      month: Month.toDTO(row.month),
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}