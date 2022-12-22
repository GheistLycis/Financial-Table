import { Service } from "typedi";
import { v4 as uuid } from "uuid";
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { OneToManyOptions } from "src/DTOs/baseDTO";
import { Month } from "./Month";
import YearDTO from "src/DTOs/year";

@Service()
@Entity("years")
export class Year  {
  // COLUMNS
  @Column()
  year: string

  // RELATIONS
  @OneToMany(() => Month, month => month.year, OneToManyOptions)
  months: Month[]

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

  public static toDTO(row: Year): YearDTO {
    return {
      year: row.year,
      months: row.months ? row.months.map(month => Month.toDTO(month)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}