import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import { BaseEntity, OneToManyOptions } from "src/configs/BaseEntity";
import { Month } from "./Month";
import YearDTO from "src/DTOs/year";

@Service()
@Entity("years")
export class Year extends BaseEntity {
  // COLUMNS
  @Column()
  year: string

  // RELATIONS
  @OneToMany(() => Month, month => month.year, OneToManyOptions)
  months: Month[]

  static toDTO(row: Year): YearDTO {
    return {
      year: row.year,
      months: row.months ? row.months.map(month => Month.toDTO(month)) : null,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}