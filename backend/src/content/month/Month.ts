import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IsInt, Max, Min } from 'class-validator';
import { BaseEntity, manyToOneOptions, OneToManyOptions } from "src/common/BaseEntity";
import { Category } from "../category/Category";
import MonthDTO from "./Month.dto";
import { Year } from "../year/Year";
import { MonthlyEntry } from "../monthly-entry/MonthlyEntry";

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

  @OneToMany(() => MonthlyEntry, entry => entry.month, OneToManyOptions)
  entries: MonthlyEntry[]

  static toDTO(row: Month): MonthDTO {
    return {
      month: row.month,
      obs: row.obs,
      year: Year.toDTO(row.year),
      categories: row.categories ? row.categories.map(category => Category.toDTO(category)) : null,
      entries: row.entries ? row.entries.map(entry => MonthlyEntry.toDTO(entry)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}