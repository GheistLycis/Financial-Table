import { Service } from "typedi";
import {
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import { BaseEntity, OneToManyOptions } from "src/shared/BaseEntity";
import { Month } from "../month/Month";
import YearDTO from "./Year.dto";

@Service()
@Entity("years")
export class Year extends BaseEntity {
  // COLUMNS
  @Column()
  year: number

  // RELATIONS
  @OneToMany(() => Month, month => month.year, OneToManyOptions)
  months: Month[]

  static toDTO(row: Year): YearDTO {
    return {
      year: row.year,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}